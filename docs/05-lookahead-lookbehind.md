# Level 4: Lookahead & Lookbehind — Visual Diagrams

---

## The Four Lookaround Types — Overview

```mermaid
flowchart TD
    LA{Lookaround<br/>Type}

    LA -->|"Positive<br/>Lookahead"| PLA["(?=pattern)<br/>✓ What MUST come AFTER<br/><br/>\\d+(?= dollars)<br/>'100' in '100 dollars'"]
    LA -->|"Negative<br/>Lookahead"| NLA["(?!pattern)<br/>✗ What must NOT come AFTER<br/><br/>\\d+(?! dollars)<br/>'50' in '100 dollars 50 euros'"]
    LA -->|"Positive<br/>Lookbehind"| PLB["(?<=pattern)<br/>✓ What MUST come BEFORE<br/><br/>(?<=\\$)\\d+<br/>'100' in '$100'"]
    LA -->|"Negative<br/>Lookbehind"| NLB["(?<!pattern)<br/>✗ What must NOT come BEFORE<br/><br/>(?<!\\$)\\d+<br/>'50' in '$100 qty 50'"]

    style PLA fill:#c8e6c9,stroke:#4CAF50
    style NLA fill:#ffcdd2,stroke:#f44336
    style PLB fill:#c8e6c9,stroke:#4CAF50
    style NLB fill:#ffcdd2,stroke:#f44336
```

---

## Key Insight: Lookarounds Don't Consume Characters

```mermaid
flowchart LR
    subgraph "Normal Match (consumes)"
        direction LR
        N1["Pattern: \\d+X"] --> N2["Matches: '100X'<br/>Consumed: '100X'<br/>Cursor moves past X"]
    end

    subgraph "Lookahead (zero-width)"
        direction LR
        L1["Pattern: \\d+(?=X)"] --> L2["Matches: '100'<br/>Consumed: '100' only<br/>X is NOT part of match"]
    end

    style N2 fill:#e3f2fd,stroke:#2196F3
    style L2 fill:#e8f5e9,stroke:#4CAF50
```

---

## Positive Lookahead — Step by Step

Pattern: `\w+(?=\.)` against "end. start middle. done"

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "end. start middle. done"

    E->>S: Try \w+ at 'e' → matches "end"
    E->>S: Lookahead (?=\.) — is next char '.'?
    S-->>E: YES! '.' is at index 3
    Note over E,S: Match: "end" at index 0 ✓<br/>(dot NOT consumed)

    E->>S: Try \w+ at 's' → matches "start"
    E->>S: Lookahead (?=\.) — is next char '.'?
    S-->>E: NO! Next is ' ' (space)
    Note over E,S: "start" — lookahead fails ✗

    E->>S: Try \w+ at 'm' → matches "middle"
    E->>S: Lookahead (?=\.) — is next char '.'?
    S-->>E: YES! '.' is at index 17
    Note over E,S: Match: "middle" at index 10 ✓
```

---

## Negative Lookahead — Step by Step

Pattern: `\b\d+\b(?! dollars)` against "100 dollars and 50 euros"

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "100 dollars and 50 euros"

    E->>S: Match \b\d+\b → "100" at index 0
    E->>S: Negative lookahead (?! dollars) — does ' dollars' follow?
    S-->>E: YES! " dollars" is right after
    Note over E,S: "100" — negative lookahead FAILS ✗<br/>(we said it must NOT follow)

    E->>S: Match \b\d+\b → "50" at index 16
    E->>S: Negative lookahead (?! dollars) — does ' dollars' follow?
    S-->>E: NO! " euros" follows instead
    Note over E,S: Match: "50" at index 16 ✓<br/>(not followed by dollars)
```

---

## Positive Lookbehind — Step by Step

Pattern: `(?<=\$)\d+` against "Price: $100, Qty: 50"

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "Price: $100, Qty: 50"

    E->>S: Found \d+ → "100" at index 8
    E->>S: Lookbehind (?<=\$) — is char BEFORE position 8 a '$'?
    S-->>E: YES! '$' is at index 7
    Note over E,S: Match: "100" at index 8 ✓

    E->>S: Found \d+ → "50" at index 18
    E->>S: Lookbehind (?<=\$) — is char before position 18 a '$'?
    S-->>E: NO! ' ' (space) is at index 17
    Note over E,S: "50" — lookbehind fails ✗
```

---

## Password Validation — Multiple Lookaheads Working Together

Pattern: `^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%]).{8,}$`

```mermaid
flowchart TD
    Input["Input: 'P@ssw0rd!'"] --> Start["^ (start of string)"]

    Start --> LA1{Lookahead 1:<br/>(?=.*[A-Z])<br/>Contains uppercase?}
    LA1 -->|"✓ Found 'P'"| LA2{Lookahead 2:<br/>(?=.*[a-z])<br/>Contains lowercase?}
    LA1 -->|"✗ No uppercase"| Fail([FAIL])

    LA2 -->|"✓ Found 's'"| LA3{Lookahead 3:<br/>(?=.*\d)<br/>Contains digit?}
    LA2 -->|"✗ No lowercase"| Fail

    LA3 -->|"✓ Found '0'"| LA4{Lookahead 4:<br/>(?=.*[!@#$%])<br/>Contains special?}
    LA3 -->|"✗ No digit"| Fail

    LA4 -->|"✓ Found '@'"| Len{.{8,}$<br/>At least 8 chars?}
    LA4 -->|"✗ No special char"| Fail

    Len -->|"✓ Length = 9"| Pass([PASS ✓])
    Len -->|"✗ Too short"| Fail

    style Pass fill:#c8e6c9,stroke:#4CAF50
    style Fail fill:#ffcdd2,stroke:#f44336
    style LA1 fill:#e3f2fd,stroke:#2196F3
    style LA2 fill:#e3f2fd,stroke:#2196F3
    style LA3 fill:#e3f2fd,stroke:#2196F3
    style LA4 fill:#e3f2fd,stroke:#2196F3
```

### Key Insight: All Lookaheads Check from the SAME Position

```mermaid
flowchart LR
    Pos["Position: ^ (start)"] --> LA1["(?=.*[A-Z])<br/>Scans entire string for uppercase"]
    Pos --> LA2["(?=.*[a-z])<br/>Scans entire string for lowercase"]
    Pos --> LA3["(?=.*\\d)<br/>Scans entire string for digit"]
    Pos --> LA4["(?=.*[!@#$%])<br/>Scans entire string for special"]

    Note["Each lookahead starts from the SAME position.<br/>They don't consume anything.<br/>They're like 'peek ahead' assertions."]

    style Pos fill:#fff9c4,stroke:#FFC107,stroke-width:2px
```

---

## Combined Lookarounds — Extract Between Delimiters

Pattern: `(?<=\().*?(?=\))` extracts text inside parentheses without including them.

```mermaid
flowchart LR
    subgraph Input
        I1["("] --> I2["5"] --> I3["5"] --> I4["5"] --> I5[")"]
    end

    subgraph Matching
        direction TB
        LB["(?<=\\() — Lookbehind:<br/>Is '(' before this position? ✓"]
        Content[".*? — Match content:<br/>'555'"]
        LA["(?=\\)) — Lookahead:<br/>Is ')' after this position? ✓"]
    end

    subgraph Result
        R["Match: '555'<br/>(without parentheses!)"]
    end

    I1 -.->|"Lookbehind checks"| LB
    LB --> Content
    Content --> LA
    I5 -.->|"Lookahead checks"| LA
    LA --> R

    style LB fill:#e3f2fd,stroke:#2196F3
    style LA fill:#fff3e0,stroke:#FF9800
    style Content fill:#e8f5e9,stroke:#4CAF50
    style R fill:#f3e5f5,stroke:#9C27B0
```

---

## Number Formatting with Lookarounds

Pattern: `(?<=\d)(?=(\d{3})+\b)` inserts commas in numbers.

```mermaid
flowchart TD
    subgraph "Input: 1234567890"
        direction LR
        D1["1"] --- D2["2"] --- D3["3"] --- D4["4"] --- D5["5"] --- D6["6"] --- D7["7"] --- D8["8"] --- D9["9"] --- D0["0"]
    end

    subgraph "Positions where commas are inserted"
        direction TB
        P1["After '1': (?<=\\d)✓ (?=(\\d{3})+\\b) = 234567890 = 3×3 digits ✓ → INSERT ,"]
        P2["After '4': (?<=\\d)✓ (?=(\\d{3})+\\b) = 567890 = 2×3 digits ✓ → INSERT ,"]
        P3["After '7': (?<=\\d)✓ (?=(\\d{3})+\\b) = 890 = 1×3 digits ✓ → INSERT ,"]
    end

    subgraph Result
        R["1,234,567,890"]
    end

    style P1 fill:#c8e6c9,stroke:#4CAF50
    style P2 fill:#c8e6c9,stroke:#4CAF50
    style P3 fill:#c8e6c9,stroke:#4CAF50
    style R fill:#f3e5f5,stroke:#9C27B0
```

---

## Lookaround Decision Guide

```mermaid
flowchart TD
    Q1{What do you need<br/>to assert?}

    Q1 -->|"Something AFTER<br/>the match"| Q2{Must it be<br/>present or absent?}
    Q1 -->|"Something BEFORE<br/>the match"| Q3{Must it be<br/>present or absent?}

    Q2 -->|"Must BE there"| PLA["(?=pattern)<br/>Positive Lookahead"]
    Q2 -->|"Must NOT be there"| NLA["(?!pattern)<br/>Negative Lookahead"]

    Q3 -->|"Must BE there"| PLB["(?<=pattern)<br/>Positive Lookbehind"]
    Q3 -->|"Must NOT be there"| NLB["(?<!pattern)<br/>Negative Lookbehind"]

    PLA --> Ex1["\\d+(?= USD)<br/>Match digits before ' USD'"]
    NLA --> Ex2["\\d+(?! USD)<br/>Match digits NOT before ' USD'"]
    PLB --> Ex3["(?<=\\$)\\d+<br/>Match digits after '$'"]
    NLB --> Ex4["(?<!\\$)\\d+<br/>Match digits NOT after '$'"]

    style PLA fill:#c8e6c9,stroke:#4CAF50
    style NLA fill:#ffcdd2,stroke:#f44336
    style PLB fill:#c8e6c9,stroke:#4CAF50
    style NLB fill:#ffcdd2,stroke:#f44336
```
