# Regex Engine Internals

Understanding how the regex engine works under the hood helps you write efficient, correct patterns.

---

## How a Regex Engine Processes a Match

When you call `Regex.IsMatch()` or `/pattern/.test()`, the engine follows this lifecycle:

```mermaid
sequenceDiagram
    participant User as Your Code
    participant API as Regex API
    participant Compiler as Pattern Compiler
    participant Engine as Matching Engine
    participant Input as Input String

    User->>API: IsMatch("Hello 123", "\d+")
    API->>Compiler: Parse pattern "\d+"
    Compiler->>Compiler: Tokenize → AST → State Machine
    Compiler-->>API: Compiled NFA/DFA
    API->>Engine: Execute match against input

    loop For each position in string
        Engine->>Input: Try match at position 0 ("H")
        Input-->>Engine: \d doesn't match "H"
        Engine->>Input: Try match at position 1 ("e")
        Input-->>Engine: \d doesn't match "e"
        Note over Engine,Input: ...skips positions 2-5...
        Engine->>Input: Try match at position 6 ("1")
        Input-->>Engine: \d matches "1"
        Engine->>Input: Try position 7 ("2")
        Input-->>Engine: \d matches "2" (+ quantifier)
        Engine->>Input: Try position 8 ("3")
        Input-->>Engine: \d matches "3" (+ quantifier)
        Engine->>Input: Try position 9 (end/non-digit)
        Input-->>Engine: \d fails → quantifier satisfied
    end

    Engine-->>API: Match found: "123" at index 6
    API-->>User: true
```

---

## NFA vs DFA — Two Types of Regex Engines

```mermaid
flowchart TB
    subgraph NFA ["NFA Engine (Used by .NET and JavaScript)"]
        direction TB
        N1[Pattern-driven]
        N2[Tries one path at a time]
        N3[Backtracks on failure]
        N4[Supports all features:<br/>backreferences, lookarounds,<br/>lazy quantifiers]
        N5[Can be slow on pathological patterns]
        N1 --> N2 --> N3 --> N4 --> N5
    end

    subgraph DFA ["DFA Engine (Used by grep, awk)"]
        direction TB
        D1[Text-driven]
        D2[Tracks ALL possible paths simultaneously]
        D3[Never backtracks]
        D4[Limited features:<br/>no backreferences,<br/>no lookarounds]
        D5[Always linear time O n]
        D1 --> D2 --> D3 --> D4 --> D5
    end

    style NFA fill:#e8f4fd,stroke:#2196F3
    style DFA fill:#e8f5e9,stroke:#4CAF50
```

---

## The Backtracking Process

This is the most important concept for understanding regex performance:

```mermaid
flowchart TD
    Start([Start matching]) --> Pos0[Try at position 0]
    Pos0 --> Try1{Does first<br/>token match?}
    Try1 -->|Yes| Try2{Does second<br/>token match?}
    Try1 -->|No| Advance[Move to next position]
    Advance --> EndCheck{End of<br/>string?}
    EndCheck -->|No| Pos0
    EndCheck -->|Yes| Fail([No match found])

    Try2 -->|Yes| Try3{Does third<br/>token match?}
    Try2 -->|No| BT1{Can we<br/>backtrack?}

    BT1 -->|Yes - give back chars| Try1
    BT1 -->|No paths left| Advance

    Try3 -->|Yes| Complete{Pattern<br/>complete?}
    Try3 -->|No| BT2{Can we<br/>backtrack?}

    BT2 -->|Yes| Try2
    BT2 -->|No| BT1

    Complete -->|Yes| Success([Match found!])
    Complete -->|No| TryNext[Try next token...]

    style Success fill:#c8e6c9,stroke:#4CAF50
    style Fail fill:#ffcdd2,stroke:#f44336
    style BT1 fill:#fff9c4,stroke:#FFC107
    style BT2 fill:#fff9c4,stroke:#FFC107
```

---

## Backtracking Example: Greedy `.*` in `".*"`

Matching `".*"` against `He said "hello" and "goodbye"`:

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as String: He said "hello" and "goodbye"

    Note over E,S: Engine finds opening " at index 8
    E->>S: .* (greedy) — consume EVERYTHING after "
    S-->>E: Consumed: hello" and "goodbye"
    Note over E: Now need closing " — but we're at end!

    E->>S: BACKTRACK: give back 'e' (index 28)
    S-->>E: Not a "
    E->>S: BACKTRACK: give back ')' → 'y' → 'b'...
    Note over E: Keeps backtracking character by character

    E->>S: BACKTRACK: give back '"' (index 27)
    S-->>E: Found closing "!
    Note over E,S: Match: "hello" and "goodbye"<br/>(greedy matched too much!)
```

### The Lazy Version: `".*?"`

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as String: He said "hello" and "goodbye"

    Note over E,S: Engine finds opening " at index 8
    E->>S: .*? (lazy) — try matching ZERO chars first
    S-->>E: Next char 'h' — is it "? No.
    E->>S: .*? expand to match 'h', try " again
    S-->>E: Next char 'e' — is it "? No.
    E->>S: .*? expand to match 'e', try " again
    Note over E: ...continues expanding one char at a time...
    E->>S: .*? matched 'hello', try " again
    S-->>E: Next char is "! ✓
    Note over E,S: Match: "hello"<br/>(lazy matched minimum!)
```

---

## Match Lifecycle — State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle: Create regex
    Idle --> Compiling: Pattern submitted
    Compiling --> Ready: Compilation success
    Compiling --> Error: Invalid pattern
    Error --> [*]

    Ready --> Scanning: Start match
    Scanning --> Matching: First char matches
    Scanning --> Advancing: First char fails
    Advancing --> Scanning: Try next position
    Advancing --> NoMatch: End of string

    Matching --> Matching: Next token matches
    Matching --> Backtracking: Token fails
    Backtracking --> Matching: Alternative found
    Backtracking --> Advancing: No alternatives
    Matching --> MatchFound: Pattern complete

    MatchFound --> [*]: Return result
    NoMatch --> [*]: Return no match
```

---

## .NET Regex Compilation Pipeline

```mermaid
flowchart LR
    subgraph Input
        P[Pattern String<br/>"\\d{3}-\\d{4}"]
    end

    subgraph Compilation
        direction TB
        Lex[Lexer/Tokenizer]
        Parse[Parser → AST]
        Opt[Optimizer]
        Gen[Code Generator]
        Lex --> Parse --> Opt --> Gen
    end

    subgraph Execution Modes
        direction TB
        Interp[Interpreted<br/>Default mode<br/>Fast startup]
        Compiled[RegexOptions.Compiled<br/>Emits IL code<br/>Fast execution]
        SrcGen["[GeneratedRegex]<br/>Compile-time C#<br/>Zero runtime cost"]
        NonBT[NonBacktracking<br/>.NET 7+<br/>Linear time O n]
    end

    P --> Compilation
    Gen --> Interp
    Gen --> Compiled
    Gen --> SrcGen
    Gen --> NonBT

    style Interp fill:#e3f2fd,stroke:#2196F3
    style Compiled fill:#e8f5e9,stroke:#4CAF50
    style SrcGen fill:#f3e5f5,stroke:#9C27B0
    style NonBT fill:#fff3e0,stroke:#FF9800
```

---

## JavaScript Regex Engine Flow

```mermaid
flowchart LR
    subgraph Input
        P["/\\d+/g"]
    end

    subgraph "V8 Engine (Node.js / Chrome)"
        direction TB
        Parse[Parser]
        Irregexp[Irregexp Engine]

        subgraph Strategies
            direction TB
            Simple[Simple: string search<br/>for literal patterns]
            Bytecode[Bytecode interpreter<br/>for complex patterns]
            Native[JIT compiled<br/>native code for hot patterns]
        end

        Parse --> Irregexp
        Irregexp --> Simple
        Irregexp --> Bytecode
        Irregexp --> Native
    end

    P --> Parse

    style Simple fill:#e8f5e9,stroke:#4CAF50
    style Bytecode fill:#e3f2fd,stroke:#2196F3
    style Native fill:#f3e5f5,stroke:#9C27B0
```
