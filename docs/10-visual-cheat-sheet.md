# Visual Cheat Sheet — Complete Regex Syntax

---

## Master Overview — All Regex Components

```mermaid
flowchart TD
    Regex["Regular Expression<br/>Components"]

    Regex --> Chars["Characters"]
    Regex --> Quant["Quantifiers"]
    Regex --> Groups["Groups"]
    Regex --> Anchors["Anchors"]
    Regex --> Look["Lookarounds"]
    Regex --> Flags["Flags/Options"]

    Chars --> Literal["Literal: abc"]
    Chars --> Dot[". any char"]
    Chars --> Class["[abc] class"]
    Chars --> Short["\\d \\w \\s shorthand"]
    Chars --> Unicode["\\p{Letter} unicode"]

    Quant --> Star["* zero+"]
    Quant --> Plus["+ one+"]
    Quant --> Opt["? optional"]
    Quant --> Exact["{n} exact"]
    Quant --> Range["{n,m} range"]
    Quant --> Lazy["? lazy modifier"]

    Groups --> Cap["(...) capture"]
    Groups --> NonCap["(?:...) non-capture"]
    Groups --> Named["(?<n>...) named"]
    Groups --> Alt["a|b alternation"]
    Groups --> BackRef["\\1 backreference"]

    Anchors --> Start["^ start"]
    Anchors --> End["$ end"]
    Anchors --> Word["\\b word boundary"]

    Look --> PLA["(?=) positive ahead"]
    Look --> NLA["(?!) negative ahead"]
    Look --> PLB["(?<=) positive behind"]
    Look --> NLB["(?<!) negative behind"]

    Flags --> FG["g global"]
    Flags --> FI["i case-insensitive"]
    Flags --> FM["m multiline"]
    Flags --> FS["s dotAll"]
    Flags --> FU["u unicode"]

    style Regex fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px
    style Chars fill:#e3f2fd,stroke:#2196F3
    style Quant fill:#e8f5e9,stroke:#4CAF50
    style Groups fill:#fff3e0,stroke:#FF9800
    style Anchors fill:#fff9c4,stroke:#FFC107
    style Look fill:#e0f2f1,stroke:#009688
    style Flags fill:#fce4ec,stroke:#E91E63
```

---

## Pattern Reading Guide — Left to Right

```mermaid
flowchart LR
    subgraph "Pattern: ^(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>\\d{2})$"
        direction LR
        A["^<br/>Start"] --> B["(?<year><br/>Named group"]
        B --> C["\\d{4}<br/>4 digits"]
        C --> D[")<br/>End group"]
        D --> E["-<br/>Literal dash"]
        E --> F["(?<month><br/>Named group"]
        F --> G["0[1-9]<br/>01-09"]
        G --> H["|<br/>OR"]
        H --> I["1[0-2]<br/>10-12"]
        I --> J[")<br/>End group"]
        J --> K["-<br/>Literal dash"]
        K --> L["(?<day><br/>Named group"]
        L --> M["\\d{2}<br/>2 digits"]
        M --> N[")<br/>End group"]
        N --> O["$<br/>End"]
    end
```

---

## Character Class Internals

```mermaid
flowchart TD
    subgraph Positive ["[aeiou] — Match IF in set"]
        direction LR
        PI["Input char"] --> PC{Is it<br/>a, e, i,<br/>o, or u?}
        PC -->|Yes| PM["MATCH ✓"]
        PC -->|No| PF["FAIL ✗"]
    end

    subgraph Negated ["[^aeiou] — Match if NOT in set"]
        direction LR
        NI["Input char"] --> NC{Is it<br/>a, e, i,<br/>o, or u?}
        NC -->|Yes| NF["FAIL ✗"]
        NC -->|No| NM["MATCH ✓"]
    end

    subgraph Range ["[a-zA-Z0-9] — Ranges"]
        direction LR
        RI["Input char"] --> RC1{In a-z?}
        RC1 -->|Yes| RM["MATCH ✓"]
        RC1 -->|No| RC2{In A-Z?}
        RC2 -->|Yes| RM
        RC2 -->|No| RC3{In 0-9?}
        RC3 -->|Yes| RM
        RC3 -->|No| RF["FAIL ✗"]
    end

    style PM fill:#c8e6c9,stroke:#4CAF50
    style PF fill:#ffcdd2,stroke:#f44336
    style NF fill:#ffcdd2,stroke:#f44336
    style NM fill:#c8e6c9,stroke:#4CAF50
    style RM fill:#c8e6c9,stroke:#4CAF50
    style RF fill:#ffcdd2,stroke:#f44336
```

---

## Quantifier Behavior — State Machine View

```mermaid
stateDiagram-v2
    [*] --> Matching: Start quantifier

    state "* (zero or more)" as Star {
        [*] --> ZeroOrMore: Can match 0 chars
        ZeroOrMore --> TryMore: char matches
        TryMore --> TryMore: char matches
        TryMore --> Done: char fails or end
        ZeroOrMore --> Done: proceed without matching
    }

    state "+ (one or more)" as Plus {
        [*] --> MustMatch1: Must match at least 1
        MustMatch1 --> Matched1: first char matches
        MustMatch1 --> Failed: first char fails
        Matched1 --> Matched1: more chars match
        Matched1 --> Done2: char fails or end
    }

    state "? (zero or one)" as Ques {
        [*] --> ZeroOrOne: Optional
        ZeroOrOne --> MatchedOne: char matches (take it)
        ZeroOrOne --> SkippedIt: no match (skip it)
        MatchedOne --> Done3
        SkippedIt --> Done3
    }
```

---

## Group Types — Complete Reference

```mermaid
flowchart TD
    subgraph Capture ["Capturing Groups"]
        C1["(abc)<br/>Numbered: \\1, $1"]
        C2["(?<name>abc)<br/>Named: \\k<name>, $<name>"]
    end

    subgraph NonCapture ["Non-Capturing"]
        NC1["(?:abc)<br/>Group only, no capture"]
    end

    subgraph Assertions ["Zero-Width Assertions"]
        A1["(?=abc) Lookahead +"]
        A2["(?!abc) Lookahead -"]
        A3["(?<=abc) Lookbehind +"]
        A4["(?<!abc) Lookbehind -"]
    end

    subgraph Special ["Special Groups"]
        S1["(?>abc) Atomic (.NET)"]
        S2["(?(cond)yes|no) Conditional (.NET)"]
        S3["(?<a>-<b>) Balancing (.NET)"]
    end

    style Capture fill:#e3f2fd,stroke:#2196F3
    style NonCapture fill:#e8f5e9,stroke:#4CAF50
    style Assertions fill:#fff9c4,stroke:#FFC107
    style Special fill:#f3e5f5,stroke:#9C27B0
```

---

## Anchor Positions — Visual Map

```mermaid
flowchart LR
    subgraph "String: 'Hello World'"
        direction LR
        Start(["^"]) -.-> H["H"]
        H --- e["e"] --- l1["l"] --- l2["l"] --- o["o"]
        o -.->|"\\b"| Space[" "]
        Space -.->|"\\b"| W["W"]
        W --- o2["o"] --- r["r"] --- l3["l"] --- d["d"]
        d -.-> End(["$"])
    end

    Legend["^ = String/line start<br/>$ = String/line end<br/>\\b = Word boundary<br/>\\B = NOT a word boundary"]

    style Start fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style End fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style Space fill:#fff9c4,stroke:#FFC107
```

---

## Flag Effects — Before and After

```mermaid
flowchart TD
    subgraph "i — Case Insensitive"
        I1["/hello/ → matches 'hello' only"]
        I2["/hello/i → matches 'Hello', 'HELLO', 'hElLo'"]
    end

    subgraph "g — Global"
        G1["match(/a/) → first 'a' only"]
        G2["match(/a/g) → ALL 'a' characters"]
    end

    subgraph "m — Multiline"
        M1["/^\\w+/ → matches first line start only"]
        M2["/^\\w+/m → matches EACH line start"]
    end

    subgraph "s — dotAll"
        S1["/.+/ → stops at newline"]
        S2["/.+/s → crosses newlines"]
    end

    subgraph "u — Unicode"
        U1["/./  → breaks emoji 😀 into 2 units"]
        U2["/./u → treats emoji 😀 as 1 char"]
    end

    style I1 fill:#ffcdd2,stroke:#f44336
    style I2 fill:#c8e6c9,stroke:#4CAF50
    style G1 fill:#ffcdd2,stroke:#f44336
    style G2 fill:#c8e6c9,stroke:#4CAF50
    style M1 fill:#ffcdd2,stroke:#f44336
    style M2 fill:#c8e6c9,stroke:#4CAF50
    style S1 fill:#ffcdd2,stroke:#f44336
    style S2 fill:#c8e6c9,stroke:#4CAF50
    style U1 fill:#ffcdd2,stroke:#f44336
    style U2 fill:#c8e6c9,stroke:#4CAF50
```

---

## Common Pattern Templates

```mermaid
flowchart TD
    subgraph Validation ["Validation Patterns"]
        V1["Email:<br/>^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"]
        V2["IPv4:<br/>^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$"]
        V3["Password:<br/>^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$"]
    end

    subgraph Extraction ["Extraction Patterns"]
        E1["URL parts:<br/>^(?<scheme>https?):\\/\\/(?<host>[^/:]+)(?::(?<port>\\d+))?"]
        E2["Key=Value:<br/>(?<key>\\w+)=(?<value>[^;]+)"]
        E3["Date:<br/>(?<y>\\d{4})-(?<m>\\d{2})-(?<d>\\d{2})"]
    end

    subgraph Transform ["Transformation Patterns"]
        T1["Number commas:<br/>(?<=\\d)(?=(\\d{3})+\\b)"]
        T2["camelCase split:<br/>(?=[A-Z])"]
        T3["Whitespace normalize:<br/>\\s{2,} → ' '"]
    end

    style Validation fill:#e3f2fd,stroke:#2196F3
    style Extraction fill:#e8f5e9,stroke:#4CAF50
    style Transform fill:#f3e5f5,stroke:#9C27B0
```
