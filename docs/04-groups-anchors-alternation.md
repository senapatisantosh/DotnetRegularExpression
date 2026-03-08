# Level 3: Groups, Anchors & Alternation — Visual Diagrams

---

## Anchors — Matching Positions, Not Characters

```mermaid
flowchart TD
    subgraph "String: 'Hello World'"
        direction LR
        START(["^<br/>Start"]) --- H["H"] --- e["e"] --- l1["l"] --- l2["l"] --- o["o"]
        o --- SP[" "]
        SP --- W["W"] --- o2["o"] --- r["r"] --- l3["l"] --- d["d"] --- END(["$<br/>End"])

        H ~~~ WB1(["\\b"])
        SP ~~~ WB2(["\\b"])
        SP ~~~ WB3(["\\b"])
        d ~~~ WB4(["\\b"])
    end

    Note1["^ = Start of string<br/>$ = End of string<br/>\\b = Word boundary (between \\w and \\W)<br/>\\B = NOT a word boundary"]

    style START fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style END fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style WB1 fill:#fff9c4,stroke:#FFC107
    style WB2 fill:#fff9c4,stroke:#FFC107
    style WB3 fill:#fff9c4,stroke:#FFC107
    style WB4 fill:#fff9c4,stroke:#FFC107
```

---

## Word Boundary (\\b) — Decision Flow

```mermaid
flowchart TD
    Start{Position in string} --> Check{What's on<br/>each side?}

    Check -->|"\\w on left<br/>\\W on right"| Match["\\b matches ✓<br/>(word → non-word)"]
    Check -->|"\\W on left<br/>\\w on right"| Match2["\\b matches ✓<br/>(non-word → word)"]
    Check -->|"\\w on left<br/>\\w on right"| NoMatch["\\b fails ✗<br/>(both word chars)"]
    Check -->|"\\W on left<br/>\\W on right"| NoMatch2["\\b fails ✗<br/>(both non-word chars)"]
    Check -->|"Start of string<br/>\\w on right"| Match3["\\b matches ✓"]
    Check -->|"\\w on left<br/>End of string"| Match4["\\b matches ✓"]

    style Match fill:#c8e6c9,stroke:#4CAF50
    style Match2 fill:#c8e6c9,stroke:#4CAF50
    style Match3 fill:#c8e6c9,stroke:#4CAF50
    style Match4 fill:#c8e6c9,stroke:#4CAF50
    style NoMatch fill:#ffcdd2,stroke:#f44336
    style NoMatch2 fill:#ffcdd2,stroke:#f44336
```

### Example: `\bcat\b` against "The cat scattered"

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "The cat scattered"

    E->>S: Position 4: \\b before 'c'? Space→c = \\W→\\w = YES ✓
    E->>S: Position 4-6: 'c','a','t' match "cat" ✓
    E->>S: Position 7: \\b after 't'? t→space = \\w→\\W = YES ✓
    Note over E,S: "cat" at index 4 — WHOLE WORD MATCH ✓

    E->>S: Position 8: \\b before 's'? space→s = YES ✓
    E->>S: Position 8-10: 's','c','a' — wait, need "cat" not "sca"
    Note over E,S: No "cat" starting at scattered

    E->>S: Position 11: \\b before 't'? 't' inside word, a→t = \\w→\\w = NO ✗
    Note over E,S: "cat" inside "scattered" — \\b fails, NOT a whole word
```

---

## Multiline Mode — How ^ and $ Change

```mermaid
flowchart TD
    subgraph Default ["Default Mode"]
        direction TB
        D1["^ matches ONLY start of entire string"]
        D2["$ matches ONLY end of entire string"]
        D3["'Line1\\nLine2\\nLine3'"]
        D4["^ → index 0 only<br/>$ → after index 16 only"]
    end

    subgraph Multiline ["Multiline Mode (m flag)"]
        direction TB
        M1["^ matches start of string AND after each \\n"]
        M2["$ matches end of string AND before each \\n"]
        M3["'Line1\\nLine2\\nLine3'"]
        M4["^ → index 0, 6, 12<br/>$ → index 5, 11, 16"]
    end

    style Default fill:#e3f2fd,stroke:#2196F3
    style Multiline fill:#e8f5e9,stroke:#4CAF50
```

---

## Capturing Groups — How They Work

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "Date: 12/25/2024"
    participant G as Groups[]

    Note over E: Pattern: (\d{1,2})/(\d{1,2})/(\d{4})

    E->>S: Match \d{1,2} → "12"
    E->>G: Store Group 1 = "12"
    E->>S: Match "/" → "/"
    E->>S: Match \d{1,2} → "25"
    E->>G: Store Group 2 = "25"
    E->>S: Match "/" → "/"
    E->>S: Match \d{4} → "2024"
    E->>G: Store Group 3 = "2024"

    Note over G: Groups[0] = "12/25/2024" (full match)<br/>Groups[1] = "12" (month)<br/>Groups[2] = "25" (day)<br/>Groups[3] = "2024" (year)
```

---

## Capturing vs Non-Capturing Groups

```mermaid
flowchart TD
    Q{Do you need the<br/>captured value?}

    Q -->|"Yes — need to<br/>extract data"| Cap["( ) Capturing Group<br/>Stores the matched text"]
    Q -->|"No — just need<br/>grouping for | or *"| NonCap["(?: ) Non-Capturing Group<br/>Groups but doesn't store"]

    Cap --> CapEx["/(\\d{3})-(\\d{4})/<br/>Groups: ['555-1234', '555', '1234']"]
    NonCap --> NonCapEx["/(?:https?):\\/\\/(\\w+)/<br/>Groups: ['https://example', 'example']<br/>Protocol NOT captured"]

    Cap --> CapUse["Use when:<br/>• Extracting parts of text<br/>• Using \\1 backreference<br/>• Using $1 in replacement"]
    NonCap --> NonCapUse["Use when:<br/>• Grouping for alternation: (?:cat|dog)<br/>• Grouping for quantifier: (?:ab)+<br/>• Better performance (no storage)"]

    style Cap fill:#e3f2fd,stroke:#2196F3
    style NonCap fill:#e8f5e9,stroke:#4CAF50
```

---

## Group Numbering — Which Group is Which?

```mermaid
flowchart TD
    Pattern["Pattern: ((\\d{2})/(\\d{2}))/(\\d{4})"]

    Pattern --> G0["Group 0: Full match<br/>'12/25/2024'"]
    Pattern --> G1["Group 1: First (<br/>'12/25' (outer group)"]
    Pattern --> G2["Group 2: Second (<br/>'12' (nested inside G1)"]
    Pattern --> G3["Group 3: Third (<br/>'25' (nested inside G1)"]
    Pattern --> G4["Group 4: Fourth (<br/>'2024'"]

    Note["Groups are numbered by the position<br/>of their OPENING parenthesis,<br/>counted left to right."]

    style G0 fill:#e0e0e0,stroke:#9E9E9E
    style G1 fill:#e3f2fd,stroke:#2196F3
    style G2 fill:#e8f5e9,stroke:#4CAF50
    style G3 fill:#fff9c4,stroke:#FFC107
    style G4 fill:#f3e5f5,stroke:#9C27B0
```

---

## Alternation — How the | Operator Works

```mermaid
flowchart TD
    Input["Input: 'I have a dog'"] --> Alt{Try alternatives<br/>left to right}

    Alt -->|"Try 'cat'"| Try1{Does 'cat'<br/>match?}
    Try1 -->|No| Try2
    Try1 -->|Yes| Done

    Alt -->|"Try 'dog'"| Try2{Does 'dog'<br/>match?}
    Try2 -->|No| Try3
    Try2 -->|Yes| Done

    Alt -->|"Try 'fish'"| Try3{Does 'fish'<br/>match?}
    Try3 -->|No| Fail([No match])
    Try3 -->|Yes| Done

    Done([Match found!])

    Note["Alternation is SHORT-CIRCUIT:<br/>Once a branch matches, it stops<br/>trying other branches."]

    style Done fill:#c8e6c9,stroke:#4CAF50
    style Fail fill:#ffcdd2,stroke:#f44336
```

---

## Backreference — Matching the Same Text Again

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "This is is a test"
    participant M as Memory

    Note over E: Pattern: \b(\w+)\s+\1\b

    E->>S: Match \b at position 5 (space→'i')
    E->>S: Match (\w+) → captures "is"
    E->>M: Store Group 1 = "is"
    E->>S: Match \s+ → " " (space at position 7)
    E->>M: What is \1?
    M-->>E: \1 = "is"
    E->>S: Match "is" at position 8?
    S-->>E: YES! "is" matches
    E->>S: Match \b after "is"?
    S-->>E: YES! 's'→' ' is a boundary

    Note over E,S: Match: "is is" at index 5<br/>The backreference \1 matched<br/>the EXACT same text "is"
```

---

## Replace with Groups — $1, $2 Flow

```mermaid
flowchart LR
    subgraph Input
        I["'John Smith'"]
    end

    subgraph Pattern
        P["/(\\w+)\\s+(\\w+)/"]
    end

    subgraph Matching
        direction TB
        G0["$0 = 'John Smith'"]
        G1["$1 = 'John'"]
        G2["$2 = 'Smith'"]
    end

    subgraph Replacement
        R["'$2, $1'"]
    end

    subgraph Output
        O["'Smith, John'"]
    end

    I --> Pattern --> Matching
    Matching --> Replacement --> Output

    style G1 fill:#e3f2fd,stroke:#2196F3
    style G2 fill:#e8f5e9,stroke:#4CAF50
    style Output fill:#f3e5f5,stroke:#9C27B0
```
