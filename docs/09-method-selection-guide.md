# Method Selection Guide — .NET vs TypeScript

---

## Complete Decision Flowchart — Which Method to Use

```mermaid
flowchart TD
    Start{What do you<br/>want to do?}

    Start -->|"Check if<br/>pattern exists"| Exists{Need<br/>position?}
    Start -->|"Find first<br/>match"| First{Need groups<br/>and details?}
    Start -->|"Find ALL<br/>matches"| All{Need details<br/>per match?}
    Start -->|"Search and<br/>replace"| Replace{Dynamic<br/>replacement?}
    Start -->|"Split<br/>string"| Split["Split"]
    Start -->|"Validate<br/>entire string"| Validate["Validate"]

    Exists -->|"No — just bool"| ExBool[".NET: Regex.IsMatch()<br/>JS: regex.test()"]
    Exists -->|"Yes — need index"| ExPos[".NET: Regex.Match().Index<br/>JS: str.search()"]

    First -->|"No — just the text"| FText[".NET: Regex.Match().Value<br/>JS: str.match(rx)?.[0]"]
    First -->|"Yes — groups too"| FDetail[".NET: Regex.Match()<br/>→ .Groups[1].Value<br/>JS: str.match(rx)<br/>→ result[1]"]

    All -->|"No — just strings"| AStrings[".NET: Regex.Matches()<br/>→ .Select(m => m.Value)<br/>JS: str.match(/rx/g)"]
    All -->|"Yes — full details"| ADetail[".NET: Regex.Matches()<br/>→ foreach (Match m)<br/>JS: str.matchAll(/rx/g)"]

    Replace -->|"No — static string"| RStatic[".NET: Regex.Replace(s, p, rep)<br/>JS: str.replace(/rx/g, rep)"]
    Replace -->|"Yes — function/delegate"| RFunc[".NET: Regex.Replace(s, p,<br/>    m => transform(m))<br/>JS: str.replace(/rx/g,<br/>    match => transform(match))"]

    Split --> SplitImpl[".NET: Regex.Split()<br/>JS: str.split(/rx/)"]

    Validate --> ValImpl["Use ^ and $ anchors:<br/>.NET: Regex.IsMatch(s, @'^pattern$')<br/>JS: /^pattern$/.test(s)"]

    style ExBool fill:#e3f2fd,stroke:#2196F3
    style ExPos fill:#e3f2fd,stroke:#2196F3
    style FText fill:#e8f5e9,stroke:#4CAF50
    style FDetail fill:#e8f5e9,stroke:#4CAF50
    style AStrings fill:#fff3e0,stroke:#FF9800
    style ADetail fill:#fff3e0,stroke:#FF9800
    style RStatic fill:#f3e5f5,stroke:#9C27B0
    style RFunc fill:#f3e5f5,stroke:#9C27B0
    style SplitImpl fill:#fff9c4,stroke:#FFC107
    style ValImpl fill:#e0f2f1,stroke:#009688
```

---

## .NET Methods — Complete Mapping

```mermaid
flowchart TD
    subgraph Static ["Static Methods (one-off use)"]
        direction TB
        S1["Regex.IsMatch(input, pattern)"]
        S2["Regex.Match(input, pattern)"]
        S3["Regex.Matches(input, pattern)"]
        S4["Regex.Replace(input, pattern, rep)"]
        S5["Regex.Split(input, pattern)"]
    end

    subgraph Instance ["Instance Methods (repeated use)"]
        direction TB
        I1["var rx = new Regex(pattern);"]
        I2["rx.IsMatch(input)"]
        I3["rx.Match(input)"]
        I4["rx.Matches(input)"]
        I5["rx.Replace(input, rep)"]
        I6["rx.Split(input)"]
    end

    subgraph Results ["Return Types"]
        direction TB
        R1["bool"]
        R2["Match<br/>.Value .Index .Groups"]
        R3["MatchCollection<br/>IEnumerable of Match"]
        R4["string (replaced)"]
        R5["string[] (parts)"]
    end

    S1 & I2 --> R1
    S2 & I3 --> R2
    S3 & I4 --> R3
    S4 & I5 --> R4
    S5 & I6 --> R5

    style Static fill:#e3f2fd,stroke:#2196F3
    style Instance fill:#e8f5e9,stroke:#4CAF50
```

---

## TypeScript/JavaScript Methods — Complete Mapping

```mermaid
flowchart TD
    subgraph RegExpMethods ["RegExp Methods"]
        direction TB
        RM1["rx.test(str) → boolean"]
        RM2["rx.exec(str) → RegExpExecArray | null"]
    end

    subgraph StringMethods ["String Methods"]
        direction TB
        SM1["str.match(rx) → array | null"]
        SM2["str.matchAll(rx) → Iterator"]
        SM3["str.replace(rx, rep) → string"]
        SM4["str.replaceAll(rx, rep) → string"]
        SM5["str.search(rx) → number"]
        SM6["str.split(rx) → string[]"]
    end

    subgraph Behavior ["Behavior depends on /g flag"]
        direction TB
        B1["match() without /g → first match with groups"]
        B2["match() with /g → all matches as strings (no groups!)"]
        B3["matchAll() requires /g → all matches with groups"]
        B4["replace() without /g → replaces FIRST only"]
        B5["replace() with /g → replaces ALL"]
    end

    SM1 --> B1 & B2
    SM2 --> B3
    SM3 --> B4 & B5

    style RegExpMethods fill:#e3f2fd,stroke:#2196F3
    style StringMethods fill:#e8f5e9,stroke:#4CAF50
    style Behavior fill:#fff9c4,stroke:#FFC107
```

---

## The /g Flag Impact — JavaScript Behavior Matrix

```mermaid
flowchart TD
    subgraph "WITHOUT /g flag"
        direction TB
        W1["str.match(/\\d+/)<br/>→ ['123', index: 4, groups: ...]<br/>First match WITH details"]
        W2["str.replace(/a/, 'b')<br/>→ Replaces FIRST match only"]
        W3["rx.exec(str)<br/>→ Returns first match<br/>rx.lastIndex stays at 0"]
        W4["rx.test(str)<br/>→ Returns boolean<br/>rx.lastIndex stays at 0"]
    end

    subgraph "WITH /g flag"
        direction TB
        G1["str.match(/\\d+/g)<br/>→ ['123', '456']<br/>All matches as strings ONLY<br/>(no index, no groups!)"]
        G2["str.replace(/a/g, 'b')<br/>→ Replaces ALL matches"]
        G3["rx.exec(str)<br/>→ Returns next match<br/>⚠️ rx.lastIndex advances!"]
        G4["rx.test(str)<br/>→ Returns boolean<br/>⚠️ rx.lastIndex advances!"]
    end

    style W1 fill:#e8f5e9,stroke:#4CAF50
    style G1 fill:#fff3e0,stroke:#FF9800
    style G3 fill:#ffcdd2,stroke:#f44336
    style G4 fill:#ffcdd2,stroke:#f44336
```

---

## Preferred Modern Approach — JavaScript

```mermaid
flowchart TD
    Task{Task} -->|"All matches with details"| MatchAll["✅ str.matchAll(/rx/g)<br/>Modern, clean, iterable<br/>No statefulness issues"]
    Task -->|"Replace all"| ReplaceG["✅ str.replace(/rx/g, rep)<br/>or str.replaceAll(rx, rep)"]
    Task -->|"Simple existence check"| Test["✅ /rx/.test(str)<br/>Note: don't reuse /g regex"]
    Task -->|"First match details"| Match["✅ str.match(/rx/)<br/>(without /g flag)"]
    Task -->|"Loop with exec"| Avoid["⚠️ Avoid if possible<br/>Use matchAll() instead"]

    style MatchAll fill:#c8e6c9,stroke:#4CAF50,stroke-width:2px
    style Avoid fill:#ffcdd2,stroke:#f44336
```

---

## Feature Comparison — .NET vs TypeScript

```mermaid
flowchart TB
    subgraph Both ["Both .NET and TypeScript"]
        direction TB
        B1["Capturing groups (...)"]
        B2["Non-capturing groups (?:...)"]
        B3["Named groups (?<name>...)"]
        B4["Lookahead (?=) (?!)"]
        B5["Lookbehind (?<=) (?<!)"]
        B6["Backreferences \\1, \\k<name>"]
        B7["Character classes [a-z]"]
        B8["All quantifiers * + ? {n,m}"]
        B9["Greedy and lazy modes"]
    end

    subgraph DotNetOnly [".NET Only"]
        direction TB
        D1["Balancing groups (?<name>-<other>)"]
        D2["RegexOptions.Compiled"]
        D3["[GeneratedRegex] source gen"]
        D4["Regex timeout (TimeSpan)"]
        D5["NonBacktracking engine"]
        D6["(?x) verbose/commented mode"]
        D7["Conditional: (?(cond)yes|no)"]
        D8["Atomic groups (?>...)"]
    end

    subgraph JSOnly ["TypeScript/JS Only"]
        direction TB
        J1["/y sticky flag"]
        J2["/s dotAll flag"]
        J3["/d hasIndices flag"]
        J4["/v unicodeSets flag"]
        J5["Set operations (&&, --)"]
        J6["Symbol.match customization"]
        J7["String.raw for patterns"]
        J8["matchAll() iterator"]
    end

    style Both fill:#e8f5e9,stroke:#4CAF50
    style DotNetOnly fill:#e3f2fd,stroke:#2196F3
    style JSOnly fill:#fff3e0,stroke:#FF9800
```
