# Level 5: Advanced & Expert Features — Visual Diagrams

---

## Named Groups vs Numbered Groups

```mermaid
flowchart TD
    subgraph Numbered ["Numbered Groups"]
        direction TB
        NP["Pattern: (\\d{4})-(\\d{2})-(\\d{2})"]
        N0["match[0] = '2024-12-25'"]
        N1["match[1] = '2024'"]
        N2["match[2] = '12'"]
        N3["match[3] = '25'"]
        NP --> N0 --> N1 --> N2 --> N3
    end

    subgraph Named ["Named Groups"]
        direction TB
        NAP["Pattern: (?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})"]
        NA0["match[0] = '2024-12-25'"]
        NA1["match.groups.year = '2024'"]
        NA2["match.groups.month = '12'"]
        NA3["match.groups.day = '25'"]
        NAP --> NA0 --> NA1 --> NA2 --> NA3
    end

    Note["Named groups are:<br/>✓ Self-documenting<br/>✓ Immune to renumbering when groups change<br/>✓ Usable in replacements as $< name >"]

    style Numbered fill:#fff3e0,stroke:#FF9800
    style Named fill:#e8f5e9,stroke:#4CAF50
```

---

## Named Group Flow — Parse, Capture, Replace

```mermaid
sequenceDiagram
    participant C as Code
    participant E as Engine
    participant G as Named Groups Map

    Note over C: Pattern: (?<first>\w+)\s+(?<last>\w+)
    C->>E: Match "John Smith"

    E->>E: \w+ matches "John"
    E->>G: Store 'first' = "John"
    E->>E: \s+ matches " "
    E->>E: \w+ matches "Smith"
    E->>G: Store 'last' = "Smith"

    E-->>C: Match found!

    C->>E: Replace with "$<last>, $<first>"
    E->>G: Lookup 'last'
    G-->>E: "Smith"
    E->>G: Lookup 'first'
    G-->>E: "John"
    E-->>C: Result: "Smith, John"
```

---

## Named Backreference — \\k\<name\>

```mermaid
flowchart TD
    Pattern["Pattern: \\b(?<word>\\w+)\\s+\\k<word>\\b"]
    Input["Input: 'This is is a test'"]

    Pattern --> Step1["(?<word>\\w+) captures 'is'"]
    Step1 --> Store["Store: word = 'is'"]
    Store --> Step2["\\s+ matches space"]
    Step2 --> Step3["\\k<word> → recall 'is'"]
    Step3 --> Check{Does next text<br/>match 'is'?}
    Check -->|"YES"| Match(["Match: 'is is' ✓"])
    Check -->|"NO"| Fail(["Backtrack and try again"])

    style Match fill:#c8e6c9,stroke:#4CAF50
    style Store fill:#e3f2fd,stroke:#2196F3
```

---

## Balancing Groups (.NET Only) — Matching Nested Structures

```mermaid
flowchart TD
    Start["Input: ((a + b) * c)"] --> Init["Stack: empty"]

    Init --> C1["Char '(' → Push to stack"]
    C1 --> S1["Stack: [1]"]

    S1 --> C2["Char '(' → Push to stack"]
    C2 --> S2["Stack: [1, 2]"]

    S2 --> C3["Chars 'a + b' → skip non-parens"]

    C3 --> C4["Char ')' → Pop from stack"]
    C4 --> S3["Stack: [1]"]

    S3 --> C5["Chars ' * c' → skip non-parens"]

    C5 --> C6["Char ')' → Pop from stack"]
    C6 --> S4["Stack: empty"]

    S4 --> Check{Stack empty?}
    Check -->|"YES"| Balanced(["BALANCED ✓"])
    Check -->|"NO"| Unbalanced(["UNBALANCED ✗"])

    style Balanced fill:#c8e6c9,stroke:#4CAF50
    style Unbalanced fill:#ffcdd2,stroke:#f44336
    style S1 fill:#e3f2fd,stroke:#2196F3
    style S2 fill:#e3f2fd,stroke:#2196F3
    style S3 fill:#e3f2fd,stroke:#2196F3
    style S4 fill:#e3f2fd,stroke:#2196F3
```

### Balancing Group Syntax Breakdown

```mermaid
flowchart LR
    subgraph Pattern
        direction TB
        P1["(?<open>\\() — On '(': PUSH to 'open' stack"]
        P2["(?<-open>\\)) — On ')': POP from 'open' stack<br/>Fails if stack is empty → unbalanced"]
        P3["(?(open)(?!)) — At end: assert stack is EMPTY<br/>If not empty → unbalanced"]
    end

    subgraph Balanced ["Balanced: ((a))"]
        direction TB
        B1["( → push  Stack: [1]"]
        B2["( → push  Stack: [1,2]"]
        B3["a → skip"]
        B4[") → pop   Stack: [1]"]
        B5[") → pop   Stack: []"]
        B6["End: stack empty ✓"]
        B1 --> B2 --> B3 --> B4 --> B5 --> B6
    end

    subgraph Unbal ["Unbalanced: ((a)"]
        direction TB
        U1["( → push  Stack: [1]"]
        U2["( → push  Stack: [1,2]"]
        U3["a → skip"]
        U4[") → pop   Stack: [1]"]
        U5["End: stack NOT empty ✗"]
        U1 --> U2 --> U3 --> U4 --> U5
    end

    style Balanced fill:#c8e6c9,stroke:#4CAF50
    style Unbal fill:#ffcdd2,stroke:#f44336
```

---

## Unicode Property Escapes

```mermaid
flowchart TD
    UP["\\p{Property}"] --> Cat{Property Type}

    Cat -->|General Category| GC["\\p{Letter} — Any letter<br/>\\p{Number} — Any number<br/>\\p{Punctuation} — Any punctuation<br/>\\p{Symbol} — Any symbol<br/>\\p{Separator} — Any separator"]

    Cat -->|Script| SC["\\p{Script=Latin} — Latin letters<br/>\\p{Script=Greek} — Greek: αβγ<br/>\\p{Script=Cyrillic} — Cyrillic: мир<br/>\\p{Script=Han} — Chinese: 世界<br/>\\p{Script=Arabic} — Arabic: مرحبا"]

    Cat -->|Binary| BN["\\p{Emoji} — Emoji chars<br/>\\p{ASCII} — ASCII range<br/>\\p{Uppercase} — Uppercase letters<br/>\\p{Lowercase} — Lowercase letters"]

    Cat -->|Negation| NEG["\\P{Letter} — NOT a letter<br/>(uppercase P = negation)"]

    Note[".NET: \\p{L} shorthand<br/>JS: \\p{Letter} — requires /u or /v flag"]

    style GC fill:#e3f2fd,stroke:#2196F3
    style SC fill:#e8f5e9,stroke:#4CAF50
    style BN fill:#fff9c4,stroke:#FFC107
    style NEG fill:#ffcdd2,stroke:#f44336
```

---

## The /v Flag (ES2024) — Unicode Set Operations

```mermaid
flowchart TD
    V["v flag features"] --> Sub["Set Subtraction: --"]
    V --> Int["Set Intersection: &&"]
    V --> Nested["Nested Classes: [[a-z][0-9]]"]
    V --> Str["String Literals: [\\q{abc|def}]"]

    Sub --> SubEx["[\\p{Letter}--[aeiou]]<br/>All letters EXCEPT vowels<br/>'Hello' → 'H', 'l', 'l'"]
    Int --> IntEx["[\\p{ASCII}&&\\p{Number}]<br/>Characters in BOTH sets<br/>'123١٢٣' → '1', '2', '3' only"]
    Nested --> NestEx["[[a-f][0-3]]<br/>Union of ranges<br/>Matches a-f or 0-3"]
    Str --> StrEx["[\\q{abc|def|ghi}]<br/>Multi-character strings<br/>in character class"]

    style Sub fill:#e3f2fd,stroke:#2196F3
    style Int fill:#e8f5e9,stroke:#4CAF50
    style Nested fill:#fff9c4,stroke:#FFC107
    style Str fill:#f3e5f5,stroke:#9C27B0
```

---

## .NET Regex Compilation Modes

```mermaid
flowchart TD
    Q{Performance<br/>requirement?}

    Q -->|"Low: occasional use"| Interpreted["Default (Interpreted)<br/>✓ Fast construction<br/>✓ Low memory<br/>✗ Slower matching"]
    Q -->|"Medium: repeated use"| Instance["Cached Instance<br/>var rx = new Regex(pattern)<br/>✓ Compiled once<br/>✓ Reused many times"]
    Q -->|"High: hot path"| Compiled["RegexOptions.Compiled<br/>✓ Emits IL at runtime<br/>✓ ~2-10x faster matching<br/>✗ Slower startup<br/>✗ More memory"]
    Q -->|"Maximum: startup matters"| SrcGen["[GeneratedRegex]<br/>✓ C# generated at build time<br/>✓ Zero runtime compilation<br/>✓ Fastest possible<br/>✗ .NET 7+ only"]
    Q -->|"Safety: untrusted input"| NonBT["RegexOptions.NonBacktracking<br/>✓ Guaranteed O(n) time<br/>✓ No catastrophic backtracking<br/>✗ No backreferences<br/>✗ .NET 7+ only"]

    style Interpreted fill:#e0e0e0,stroke:#9E9E9E
    style Instance fill:#e3f2fd,stroke:#2196F3
    style Compiled fill:#e8f5e9,stroke:#4CAF50
    style SrcGen fill:#f3e5f5,stroke:#9C27B0
    style NonBT fill:#fff3e0,stroke:#FF9800
```

---

## MatchEvaluator / Function Callback Flow

```mermaid
sequenceDiagram
    participant C as Your Code
    participant E as Regex Engine
    participant F as Callback Function
    participant B as Result Builder

    C->>E: Replace("I have 3 cats and 5 dogs", /\d+/g, fn)

    E->>E: Match "3" at index 7
    E->>F: Call fn("3")
    F->>F: parseInt("3") * 2 = 6
    F-->>E: Return "6"
    E->>B: Append "I have " + "6"

    E->>E: Match "5" at index 17
    E->>F: Call fn("5")
    F->>F: parseInt("5") * 2 = 10
    F-->>E: Return "10"
    E->>B: Append " cats and " + "10"

    E->>B: Append " dogs"

    B-->>C: "I have 6 cats and 10 dogs"
```

---

## Regex Timeout (.NET) — Safety Net

```mermaid
flowchart TD
    Start["Start matching<br/>Timeout: 2 seconds"] --> Engine["Engine processing..."]

    Engine --> Check{Elapsed time<br/>> timeout?}

    Check -->|"No"| Continue{Match<br/>complete?}
    Continue -->|"Yes"| Result([Return match])
    Continue -->|"No"| Engine

    Check -->|"Yes"| Throw["Throw RegexMatchTimeoutException"]
    Throw --> Catch["Catch and handle gracefully"]

    Catch --> Safe["Input was likely malicious<br/>or pattern has catastrophic backtracking"]

    style Result fill:#c8e6c9,stroke:#4CAF50
    style Throw fill:#ffcdd2,stroke:#f44336
    style Safe fill:#fff9c4,stroke:#FFC107
```
