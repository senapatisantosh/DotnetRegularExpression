# Level 1 & 2: Beginner Concepts — Visual Diagrams

---

## How Literal Matching Works

```mermaid
sequenceDiagram
    participant E as Engine
    participant S as "The cat sat"

    Note over E: Pattern: "cat"
    E->>S: Position 0: 'T' = 'c'?
    S-->>E: No → advance
    E->>S: Position 1: 'h' = 'c'?
    S-->>E: No → advance
    E->>S: Position 2: 'e' = 'c'?
    S-->>E: No → advance
    E->>S: Position 3: ' ' = 'c'?
    S-->>E: No → advance
    E->>S: Position 4: 'c' = 'c'?
    S-->>E: Yes! ✓
    E->>S: Position 5: 'a' = 'a'?
    S-->>E: Yes! ✓
    E->>S: Position 6: 't' = 't'?
    S-->>E: Yes! ✓
    Note over E,S: Match found: "cat" at index 4
```

---

## The Dot (.) Metacharacter — What It Matches

```mermaid
flowchart TD
    Dot[". (dot)"] --> Check{What flag<br/>is set?}

    Check -->|No flags| Default["Matches ANY character<br/>EXCEPT newline \\n"]
    Check -->|"s flag (dotAll)<br/>or Singleline"| All["Matches ANY character<br/>INCLUDING newline \\n"]

    Default --> Ex1["'a' ✓"]
    Default --> Ex2["'Z' ✓"]
    Default --> Ex3["'9' ✓"]
    Default --> Ex4["'@' ✓"]
    Default --> Ex5["' ' (space) ✓"]
    Default --> Ex6["'\\n' (newline) ✗"]

    All --> Ex7["Everything above ✓"]
    All --> Ex8["'\\n' ✓ (now matches!)"]

    style Dot fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style Ex6 fill:#ffcdd2,stroke:#f44336
    style Ex8 fill:#c8e6c9,stroke:#4CAF50
```

---

## Shorthand Character Classes — Decision Tree

```mermaid
flowchart TD
    Q{What type of<br/>character do you<br/>want to match?}

    Q -->|Digits 0-9| D["\\d<br/>[0-9]"]
    Q -->|NOT digits| ND["\\D<br/>[^0-9]"]
    Q -->|"Word chars<br/>(letters, digits, _)"| W["\\w<br/>[a-zA-Z0-9_]"]
    Q -->|NOT word chars| NW["\\W<br/>[^a-zA-Z0-9_]"]
    Q -->|"Whitespace<br/>(space, tab, newline)"| S["\\s<br/>[ \\t\\n\\r\\f\\v]"]
    Q -->|NOT whitespace| NS["\\S<br/>[^ \\t\\n\\r\\f\\v]"]
    Q -->|Any character| DOT[". (dot)"]
    Q -->|Specific set| CC["[abc]<br/>Custom class"]

    style D fill:#e3f2fd,stroke:#2196F3
    style ND fill:#ffcdd2,stroke:#f44336
    style W fill:#e8f5e9,stroke:#4CAF50
    style NW fill:#ffcdd2,stroke:#f44336
    style S fill:#fff9c4,stroke:#FFC107
    style NS fill:#ffcdd2,stroke:#f44336
    style DOT fill:#f3e5f5,stroke:#9C27B0
    style CC fill:#fff3e0,stroke:#FF9800
```

---

## Which Method to Use — .NET

```mermaid
flowchart TD
    Start{What do you<br/>need to do?}

    Start -->|"Just check if<br/>pattern exists"| IsMatch["Regex.IsMatch()<br/>Returns: bool"]
    Start -->|"Find the FIRST<br/>match"| Match["Regex.Match()<br/>Returns: Match"]
    Start -->|"Find ALL<br/>matches"| Matches["Regex.Matches()<br/>Returns: MatchCollection"]
    Start -->|"Search and<br/>replace"| Replace["Regex.Replace()<br/>Returns: string"]
    Start -->|"Split string<br/>by pattern"| Split["Regex.Split()<br/>Returns: string[]"]

    IsMatch --> IsMatchEx["if (Regex.IsMatch(input, @\"\\d+\"))<br/>    // contains digits"]
    Match --> MatchEx["var m = Regex.Match(input, @\"\\d+\");<br/>m.Value, m.Index, m.Groups"]
    Matches --> MatchesEx["var ms = Regex.Matches(input, @\"\\d+\");<br/>foreach (Match m in ms) { ... }"]
    Replace --> ReplaceEx["Regex.Replace(input, @\"\\d+\", \"#\")<br/>// replaces ALL by default"]
    Split --> SplitEx["Regex.Split(input, @\",\\s*\")<br/>// split on comma+space"]

    style IsMatch fill:#e3f2fd,stroke:#2196F3
    style Match fill:#e8f5e9,stroke:#4CAF50
    style Matches fill:#fff3e0,stroke:#FF9800
    style Replace fill:#f3e5f5,stroke:#9C27B0
    style Split fill:#fff9c4,stroke:#FFC107
```

---

## Which Method to Use — TypeScript/JavaScript

```mermaid
flowchart TD
    Start{What do you<br/>need to do?}

    Start -->|"Just check if<br/>pattern exists"| Test["regex.test(str)<br/>Returns: boolean"]
    Start -->|"Find first match<br/>with details"| Match["str.match(regex)<br/>Returns: RegExpMatchArray | null<br/>(without /g flag)"]
    Start -->|"Find ALL matches<br/>as strings"| MatchG["str.match(regex)<br/>Returns: string[] | null<br/>(with /g flag)"]
    Start -->|"Find ALL matches<br/>with full details"| MatchAll["str.matchAll(regex)<br/>Returns: Iterator<br/>(requires /g flag)"]
    Start -->|"Search and<br/>replace"| Replace["str.replace(regex, rep)<br/>Returns: string<br/>(use /g for all)"]
    Start -->|"Split by<br/>pattern"| Split["str.split(regex)<br/>Returns: string[]"]
    Start -->|"Find position<br/>of first match"| Search["str.search(regex)<br/>Returns: number (-1 if none)"]

    style Test fill:#e3f2fd,stroke:#2196F3
    style Match fill:#e8f5e9,stroke:#4CAF50
    style MatchG fill:#c8e6c9,stroke:#4CAF50
    style MatchAll fill:#fff3e0,stroke:#FF9800
    style Replace fill:#f3e5f5,stroke:#9C27B0
    style Split fill:#fff9c4,stroke:#FFC107
    style Search fill:#e0f2f1,stroke:#009688
```

---

## Escaping Special Characters — When to Escape

```mermaid
flowchart TD
    Q{Is the character<br/>you want to match<br/>one of these?}

    Q -->|Yes| Special[". * + ? ^ $ \| \\ ( ) [ ] { }"]
    Q -->|No| NoEscape["No escaping needed!<br/>Just use the character as-is"]

    Special --> Escape["Prefix with backslash: \\"]

    Escape --> Ex1["Match a dot: \\.<br/>/price is \\$\\d+\\.\\d{2}/"]
    Escape --> Ex2["Match parens: \\( \\)<br/>/\\(\\d{3}\\)/"]
    Escape --> Ex3["Match brackets: \\[ \\]<br/>/\\[\\w+\\]/"]

    Special --> DynQ{Is the pattern<br/>dynamic / from<br/>user input?}
    DynQ -->|Yes .NET| DynNET["Use Regex.Escape(userInput)"]
    DynQ -->|Yes JS| DynJS["Write your own escapeRegex()<br/>str.replace(/[.*+?^${}()|\\[\\]\\\\]/g, '\\\\$&')"]

    style Special fill:#ffcdd2,stroke:#f44336
    style NoEscape fill:#c8e6c9,stroke:#4CAF50
    style DynNET fill:#e3f2fd,stroke:#2196F3
    style DynJS fill:#fff3e0,stroke:#FF9800
```

---

## Static vs Instance Regex (.NET)

```mermaid
flowchart TD
    Q{How many times will<br/>you use this pattern?}

    Q -->|"Once or twice<br/>(one-off checks)"| Static["Static methods<br/>Regex.IsMatch(input, pattern)"]
    Q -->|"Many times<br/>(in a loop)"| Instance["Instance (reuse)<br/>var rx = new Regex(pattern)"]
    Q -->|"Hot path<br/>(performance critical)"| Compiled["Compiled instance<br/>new Regex(pattern, RegexOptions.Compiled)"]
    Q -->|"Absolute best<br/>performance"| SrcGen["Source generator (.NET 7+)<br/>[GeneratedRegex(pattern)]"]

    Static --> StaticNote["✓ Convenient<br/>✓ Internal cache (15 entries)<br/>✗ Recompiles if cache evicted"]
    Instance --> InstanceNote["✓ Compiled once, reused<br/>✓ No cache eviction risk<br/>✗ Slightly more code"]
    Compiled --> CompiledNote["✓ Emits IL for fast matching<br/>✗ Slower construction<br/>✗ More memory"]
    SrcGen --> SrcGenNote["✓ Zero runtime compilation<br/>✓ Fastest possible<br/>✗ .NET 7+ only"]

    style Static fill:#e3f2fd,stroke:#2196F3
    style Instance fill:#e8f5e9,stroke:#4CAF50
    style Compiled fill:#fff3e0,stroke:#FF9800
    style SrcGen fill:#f3e5f5,stroke:#9C27B0
```

---

## Regex Literal vs Constructor (TypeScript)

```mermaid
flowchart TD
    Q{Is the pattern<br/>known at<br/>compile time?}

    Q -->|"Yes — static pattern"| Literal["/pattern/flags<br/>Literal syntax"]
    Q -->|"No — from variable<br/>or user input"| Constructor["new RegExp(pattern, flags)<br/>Constructor syntax"]

    Literal --> LitPros["✓ No double-escaping<br/>✓ Syntax highlighting<br/>✓ Engine can optimize at parse time<br/>✓ Cleaner code"]
    Constructor --> ConPros["✓ Dynamic patterns<br/>✓ Combine variables<br/>✗ Must double-escape: \\\\d<br/>💡 Use String.raw to avoid double-escaping"]

    Constructor --> Raw["String.raw`\\d+\\.\\d+`<br/>No double escaping needed!"]

    style Literal fill:#e8f5e9,stroke:#4CAF50
    style Constructor fill:#e3f2fd,stroke:#2196F3
    style Raw fill:#fff9c4,stroke:#FFC107
```
