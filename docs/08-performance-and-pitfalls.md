# Performance & Pitfalls — Visual Diagrams

---

## Catastrophic Backtracking — The #1 Performance Killer

Pattern `(a+)+$` against "aaaaaaaaaaab":

```mermaid
flowchart TD
    Start["Pattern: (a+)+$<br/>Input: 'aaaaab'"] --> Try1["Try: (aaaaa)(b) → $ fails, b≠end"]
    Try1 --> BT1["Backtrack: (aaaa)(a)(b) → $ fails"]
    BT1 --> BT2["Backtrack: (aaaa)(ab) → a+ fails on b"]
    BT2 --> BT3["Backtrack: (aaa)(aa)(b) → $ fails"]
    BT3 --> BT4["Backtrack: (aaa)(a)(a)(b) → $ fails"]
    BT4 --> BT5["..."]
    BT5 --> BT6["Tries EVERY possible way to split 'aaaaa'<br/>into groups of a+"]
    BT6 --> Exp["2^n combinations!<br/>5 a's = 16 paths<br/>20 a's = 1,048,576 paths<br/>30 a's = 1,073,741,824 paths"]
    Exp --> Hang(["APPLICATION HANGS"])

    style Hang fill:#ffcdd2,stroke:#f44336,stroke-width:3px
    style Exp fill:#fff9c4,stroke:#FFC107
```

---

## Catastrophic Backtracking — Visualized

```mermaid
flowchart LR
    subgraph "Exponential: (a+)+$"
        direction TB
        E5["5 chars → 16 paths"]
        E10["10 chars → 1,024 paths"]
        E20["20 chars → 1,048,576 paths"]
        E25["25 chars → 33,554,432 paths"]
        E30["30 chars → 1 BILLION+ paths"]
    end

    subgraph "Linear: a+$"
        direction TB
        L5["5 chars → 5 steps"]
        L10["10 chars → 10 steps"]
        L20["20 chars → 20 steps"]
        L25["25 chars → 25 steps"]
        L30["30 chars → 30 steps"]
    end

    style E30 fill:#ffcdd2,stroke:#f44336,stroke-width:3px
    style L30 fill:#c8e6c9,stroke:#4CAF50
```

---

## Dangerous Pattern Detection — Decision Tree

```mermaid
flowchart TD
    Q1{Does your pattern have<br/>NESTED quantifiers?}

    Q1 -->|"Yes: (a+)+, (a*)*,<br/>(a+|b)+, ([a-z]+)*"| DANGER["⚠️ HIGH RISK<br/>Catastrophic backtracking"]
    Q1 -->|"No"| Q2{Does it have<br/>overlapping alternatives<br/>with quantifiers?}

    Q2 -->|"Yes: (a|a)+, (\\w+|\\d+)+"| DANGER
    Q2 -->|"No"| Q3{Does it use .* or .+<br/>before another pattern<br/>that could fail?}

    Q3 -->|"Yes: .*\\d+$"| WARN["⚠️ MEDIUM RISK<br/>Excessive backtracking"]
    Q3 -->|"No"| Safe["✓ SAFE<br/>No backtracking issues"]

    DANGER --> Fix1["FIX OPTIONS:<br/>1. Use atomic group: (?>a+)+<br/>2. Simplify: a+<br/>3. Use .NET NonBacktracking<br/>4. Set timeout"]
    WARN --> Fix2["FIX OPTIONS:<br/>1. Be specific: [^x]* instead of .*<br/>2. Use lazy: .*?<br/>3. Add anchors"]

    style DANGER fill:#ffcdd2,stroke:#f44336,stroke-width:3px
    style WARN fill:#fff9c4,stroke:#FFC107
    style Safe fill:#c8e6c9,stroke:#4CAF50
```

---

## Performance Optimization Decision Flow

```mermaid
flowchart TD
    Start{How often is<br/>this regex used?}

    Start -->|"Once"| Static["Use static method<br/>Regex.IsMatch(str, pat)<br/>or /pattern/.test(str)"]
    Start -->|"In a loop /<br/>multiple times"| Cache["Cache the instance<br/>var rx = new Regex(pat);<br/>const rx = /pattern/;"]
    Start -->|"Hot path /<br/>millions of calls"| Perf{Which platform?}

    Perf -->|".NET"| DotNetPerf{Feature needs?}
    DotNetPerf -->|"Full features"| Compiled["RegexOptions.Compiled<br/>or [GeneratedRegex]"]
    DotNetPerf -->|"No backreferences<br/>needed"| NonBT["RegexOptions.NonBacktracking<br/>Guaranteed O(n)"]

    Perf -->|"JavaScript"| JSPerf["Cache regex literal<br/>const rx = /pattern/g;<br/>Reset rx.lastIndex = 0"]

    Static --> StringQ{Could a string<br/>method work instead?}
    StringQ -->|"Yes"| UseString["Use string methods!<br/>includes, startsWith,<br/>indexOf, endsWith"]
    StringQ -->|"No"| KeepRegex["Use regex"]

    style UseString fill:#c8e6c9,stroke:#4CAF50,stroke-width:2px
    style Compiled fill:#e3f2fd,stroke:#2196F3
    style NonBT fill:#f3e5f5,stroke:#9C27B0
```

---

## Greedy .* vs Specific [^x]* — Performance Comparison

```mermaid
sequenceDiagram
    participant G as Greedy: ".*"
    participant S as Specific: "[^"]*"
    participant Input as He said "hello" and "bye"

    Note over G,Input: GREEDY ".*" — lots of backtracking
    G->>Input: .* grabs EVERYTHING after first "
    G->>Input: Backtrack... give back 'e'
    G->>Input: Backtrack... give back 'y'
    G->>Input: Backtrack... give back 'b'
    G->>Input: Backtrack... give back '"'
    G->>Input: Backtrack... give back ' '
    G->>Input: Backtrack... give back 'd'
    G->>Input: Backtrack... give back 'n'
    G->>Input: Backtrack... give back 'a'
    G->>Input: Backtrack... give back '"' → Found closing "!
    Note over G: 9 backtracks 😰

    Note over S,Input: SPECIFIC "[^"]*" — zero backtracking
    S->>Input: [^"]* matches only non-quote chars: 'hello'
    S->>Input: Next char is " → done!
    Note over S: 0 backtracks 🚀
```

---

## The /g Flag Statefulness Pitfall (JavaScript)

```mermaid
sequenceDiagram
    participant C as Code
    participant R as /\d+/g (lastIndex=0)

    C->>R: rx.test("abc123")
    R-->>C: true (found "123")
    Note over R: lastIndex is now 6

    C->>R: rx.test("abc123")
    Note over R: Starts searching at index 6!
    R-->>C: false (nothing after index 6!)
    Note over R: lastIndex reset to 0

    C->>R: rx.test("abc123")
    R-->>C: true (starts at 0 again)
    Note over R: lastIndex is now 6

    Note over C,R: BUG! Alternating true/false!<br/>Fix: rx.lastIndex = 0 before each test<br/>Or: don't reuse /g regex with test()
```

---

## Common Pitfalls — Quick Reference

```mermaid
flowchart TD
    subgraph P1 ["Pitfall 1: Greedy by default"]
        direction LR
        Bad1["❌ <.*><br/>Matches too much"] --> Fix1["✅ <[^>]*><br/>or <.*?>"]
    end

    subgraph P2 ["Pitfall 2: Forgetting /g flag (JS)"]
        direction LR
        Bad2["❌ 'aaa'.replace(/a/, 'b')<br/>Result: 'baa'"] --> Fix2["✅ 'aaa'.replace(/a/g, 'b')<br/>Result: 'bbb'"]
    end

    subgraph P3 ["Pitfall 3: Not escaping user input"]
        direction LR
        Bad3["❌ new RegExp(userInput)<br/>Breaks if input has . * +"] --> Fix3["✅ new RegExp(escapeRegex(userInput))"]
    end

    subgraph P4 ["Pitfall 4: Nested quantifiers"]
        direction LR
        Bad4["❌ (a+)+<br/>Catastrophic backtracking"] --> Fix4["✅ a+<br/>Simplify!"]
    end

    subgraph P5 ["Pitfall 5: Using regex for simple tasks"]
        direction LR
        Bad5["❌ /^http/.test(url)<br/>Slower, harder to read"] --> Fix5["✅ url.startsWith('http')<br/>Faster, clearer"]
    end

    subgraph P6 ["Pitfall 6: No timeout on untrusted input"]
        direction LR
        Bad6["❌ new Regex(pattern)<br/>Can hang forever"] --> Fix6["✅ new Regex(pattern, opts,<br/>TimeSpan.FromSeconds(2))"]
    end

    style Bad1 fill:#ffcdd2,stroke:#f44336
    style Bad2 fill:#ffcdd2,stroke:#f44336
    style Bad3 fill:#ffcdd2,stroke:#f44336
    style Bad4 fill:#ffcdd2,stroke:#f44336
    style Bad5 fill:#ffcdd2,stroke:#f44336
    style Bad6 fill:#ffcdd2,stroke:#f44336
    style Fix1 fill:#c8e6c9,stroke:#4CAF50
    style Fix2 fill:#c8e6c9,stroke:#4CAF50
    style Fix3 fill:#c8e6c9,stroke:#4CAF50
    style Fix4 fill:#c8e6c9,stroke:#4CAF50
    style Fix5 fill:#c8e6c9,stroke:#4CAF50
    style Fix6 fill:#c8e6c9,stroke:#4CAF50
```

---

## Performance Tier Chart

```mermaid
flowchart LR
    subgraph Fastest ["🥇 Fastest"]
        direction TB
        F1["String methods<br/>includes, startsWith, indexOf"]
        F2["[GeneratedRegex] (.NET 7+)<br/>Compiled at build time"]
    end

    subgraph Fast ["🥈 Fast"]
        direction TB
        F3["Cached regex literal<br/>const rx = /pattern/"]
        F4["RegexOptions.Compiled (.NET)<br/>IL emitted at runtime"]
    end

    subgraph Medium ["🥉 Medium"]
        direction TB
        F5["Cached new Regex(pattern)<br/>Interpreted mode"]
    end

    subgraph Slow ["🐌 Slow"]
        direction TB
        F6["Static Regex.IsMatch()<br/>Checks cache, may recompile"]
        F7["new RegExp() in loop<br/>Recompiled every iteration"]
    end

    Fastest --> Fast --> Medium --> Slow

    style Fastest fill:#c8e6c9,stroke:#4CAF50
    style Fast fill:#e3f2fd,stroke:#2196F3
    style Medium fill:#fff9c4,stroke:#FFC107
    style Slow fill:#ffcdd2,stroke:#f44336
```
