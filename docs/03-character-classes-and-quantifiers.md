# Level 2: Character Classes & Quantifiers — Visual Diagrams

---

## Character Class Matching Flow

```mermaid
flowchart TD
    Input["Input character"] --> Type{What type of<br/>character class?}

    Type -->|"[abc]"| Pos{Is char<br/>a, b, or c?}
    Type -->|"[^abc]"| Neg{Is char<br/>NOT a, b, or c?}
    Type -->|"[a-z]"| Range{Is char in<br/>range a..z?}
    Type -->|"[a-zA-Z0-9]"| Multi{Is char in<br/>ANY range?}

    Pos -->|Yes| Match([Match ✓])
    Pos -->|No| Fail([No match ✗])

    Neg -->|Yes| Match
    Neg -->|No| Fail

    Range -->|Yes| Match
    Range -->|No| Fail

    Multi -->|Yes| Match
    Multi -->|No| Fail

    style Match fill:#c8e6c9,stroke:#4CAF50
    style Fail fill:#ffcdd2,stroke:#f44336
```

---

## Character Class — Inside the Brackets

```mermaid
flowchart LR
    subgraph "Inside [...] — Special Rules"
        direction TB
        R1["Most metacharacters are LITERAL<br/>. * + ? | ( ) { } are just themselves"]
        R2["Only these need escaping:<br/>] must be \\]<br/>\\ must be \\\\<br/>^ at start means negation<br/>- between chars means range"]
        R3["Examples:<br/>[.] matches literal dot<br/>[+*] matches + or *<br/>[-] matches literal hyphen"]
    end

    subgraph "Outside [...] — Normal Rules"
        direction TB
        R4["All metacharacters are special:<br/>. matches any char<br/>* + ? are quantifiers<br/>| is alternation<br/>( ) create groups"]
        R5["Must escape to match literally:<br/>\\. \\* \\+ \\? \\| \\( \\)"]
    end

    style R1 fill:#e8f5e9,stroke:#4CAF50
    style R4 fill:#ffcdd2,stroke:#f44336
```

---

## Quantifier Overview — How Many Times to Match

```mermaid
flowchart TD
    Q{How many repetitions<br/>do you need?}

    Q -->|"Zero or more<br/>(0, 1, 2, ...)"| Star["*<br/>Examples: a*, \\d*, [a-z]*"]
    Q -->|"One or more<br/>(1, 2, 3, ...)"| Plus["+<br/>Examples: a+, \\d+, [a-z]+"]
    Q -->|"Zero or one<br/>(optional)"| QMark["?<br/>Examples: colou?r, https?"]
    Q -->|"Exactly n times"| ExactN["{n}<br/>Example: \\d{3} = exactly 3 digits"]
    Q -->|"n or more times"| NPlus["{n,}<br/>Example: \\d{2,} = 2 or more digits"]
    Q -->|"Between n and m"| Range["{n,m}<br/>Example: \\d{2,4} = 2 to 4 digits"]

    Star --> StarEx["ct ✓  cat ✓  caat ✓  caaat ✓"]
    Plus --> PlusEx["ct ✗  cat ✓  caat ✓  caaat ✓"]
    QMark --> QMarkEx["color ✓  colour ✓"]

    style Star fill:#e3f2fd,stroke:#2196F3
    style Plus fill:#e8f5e9,stroke:#4CAF50
    style QMark fill:#fff9c4,stroke:#FFC107
    style ExactN fill:#fff3e0,stroke:#FF9800
    style NPlus fill:#f3e5f5,stroke:#9C27B0
    style Range fill:#e0f2f1,stroke:#009688
```

---

## Greedy vs Lazy — The Core Difference

```mermaid
flowchart TD
    subgraph Greedy ["Greedy (Default): Match as MUCH as possible"]
        direction LR
        G1["Start"] --> G2["Consume MAX chars"]
        G2 --> G3{Rest of pattern<br/>matches?}
        G3 -->|Yes| G4["Done ✓"]
        G3 -->|No| G5["Give back 1 char<br/>(backtrack)"]
        G5 --> G3
    end

    subgraph Lazy ["Lazy (add ?): Match as LITTLE as possible"]
        direction LR
        L1["Start"] --> L2["Consume MIN chars<br/>(often zero)"]
        L2 --> L3{Rest of pattern<br/>matches?}
        L3 -->|Yes| L4["Done ✓"]
        L3 -->|No| L5["Consume 1 more char<br/>(expand)"]
        L5 --> L3
    end

    style Greedy fill:#ffcdd2,stroke:#f44336
    style Lazy fill:#c8e6c9,stroke:#4CAF50
```

---

## Greedy vs Lazy — Step by Step Example

Pattern `".*"` vs `".*?"` against: `He said "hello" and "goodbye"`

```mermaid
sequenceDiagram
    participant G as Greedy .*
    participant S as He said "hello" and "goodbye"
    participant L as Lazy .*?

    Note over G,S: GREEDY: ".*"
    G->>S: Match opening " at index 8
    G->>S: .* grabs EVERYTHING → 'hello" and "goodbye'
    G->>S: Need closing " — at end, no match
    G->>S: Backtrack: give back 'e' 'y' 'b' 'd' 'o' 'o' 'g' '"'
    G->>S: Found " at index 27
    Note over G,S: Result: "hello" and "goodbye"<br/>(too much!)

    Note over L,S: LAZY: ".*?"
    L->>S: Match opening " at index 8
    L->>S: .*? tries ZERO chars first
    L->>S: Is next char "? No, it's 'h'
    L->>S: Expand: match 'h', try " again
    L->>S: Expand: match 'e', try " again
    L->>S: Expand: match 'l', 'l', 'o'
    L->>S: Is next char "? YES at index 14!
    Note over L,S: Result: "hello"<br/>(just right!)
```

---

## Greedy vs Lazy — Quantifier Comparison Table

```mermaid
flowchart LR
    subgraph Greedy ["Greedy Quantifiers"]
        direction TB
        G1["*   — 0 or more (max)"]
        G2["+   — 1 or more (max)"]
        G3["?   — 0 or 1 (prefer 1)"]
        G4["{n,m} — n to m (prefer m)"]
    end

    subgraph Lazy ["Lazy Quantifiers (add ?)"]
        direction TB
        L1["*?  — 0 or more (min)"]
        L2["+?  — 1 or more (min)"]
        L3["??  — 0 or 1 (prefer 0)"]
        L4["{n,m}? — n to m (prefer n)"]
    end

    G1 ---|"Add ?"| L1
    G2 ---|"Add ?"| L2
    G3 ---|"Add ?"| L3
    G4 ---|"Add ?"| L4

    style Greedy fill:#ffcdd2,stroke:#f44336
    style Lazy fill:#c8e6c9,stroke:#4CAF50
```

---

## Replace Flow — How Regex Replace Works

```mermaid
sequenceDiagram
    participant C as Your Code
    participant E as Regex Engine
    participant B as Result Builder

    C->>E: Replace("abc123def456", /\d+/g, "#")

    E->>E: Find match "123" at index 3
    E->>B: Append "abc" (before match)
    E->>B: Append "#" (replacement)

    E->>E: Find match "456" at index 9
    E->>B: Append "def" (between matches)
    E->>B: Append "#" (replacement)

    E->>E: No more matches
    E->>B: Append "" (after last match)

    B-->>C: Return "abc#def#"
```

---

## Split Flow — How Regex Split Works

```mermaid
flowchart LR
    Input["'apple, banana, cherry'"] --> Pattern["/,\\s*/"]
    Pattern --> Engine{Find<br/>separator}

    Engine --> S1["'apple'"]
    Engine --> Sep1["', '"]
    Engine --> S2["'banana'"]
    Engine --> Sep2["', '"]
    Engine --> S3["'cherry'"]

    S1 --> Result
    S2 --> Result
    S3 --> Result

    Result["['apple', 'banana', 'cherry']"]

    style Sep1 fill:#ffcdd2,stroke:#f44336
    style Sep2 fill:#ffcdd2,stroke:#f44336
    style Result fill:#c8e6c9,stroke:#4CAF50
```
