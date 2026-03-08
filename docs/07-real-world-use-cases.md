# Level 6: Real-World Use Cases — Visual Diagrams

---

## Email Validation Flow

```mermaid
flowchart TD
    Input["Input email"] --> Local{Valid local part?<br/>[a-zA-Z0-9._%+-]+}

    Local -->|"✓ 'user.name+tag'"| At{Has @ symbol?}
    Local -->|"✗ empty or invalid chars"| Fail([INVALID])

    At -->|"✓"| Domain{Valid domain?<br/>[a-zA-Z0-9.-]+}
    At -->|"✗"| Fail

    Domain -->|"✓ 'example.co'"| Dot{Has dot in domain?}
    Domain -->|"✗"| Fail

    Dot -->|"✓"| TLD{Valid TLD?<br/>[a-zA-Z]{2,}}
    Dot -->|"✗"| Fail

    TLD -->|"✓ 'com', 'uk'"| Pass([VALID ✓])
    TLD -->|"✗ too short"| Fail

    style Pass fill:#c8e6c9,stroke:#4CAF50
    style Fail fill:#ffcdd2,stroke:#f44336
```

### Email Pattern Breakdown

```mermaid
flowchart LR
    subgraph "Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        direction TB
        P1["^"] --- P2["[a-zA-Z0-9._%+-]+"] --- P3["@"] --- P4["[a-zA-Z0-9.-]+"] --- P5["\\."] --- P6["[a-zA-Z]{2,}"] --- P7["$"]

        P1 -.- N1["Start"]
        P2 -.- N2["Local part:<br/>letters, digits,<br/>._%+-"]
        P3 -.- N3["@ symbol"]
        P4 -.- N4["Domain:<br/>letters, digits,<br/>dots, hyphens"]
        P5 -.- N5["Literal dot"]
        P6 -.- N6["TLD: 2+ letters"]
        P7 -.- N7["End"]
    end
```

---

## URL Parsing — Component Extraction

```mermaid
flowchart TD
    URL["https://www.example.com:8080/api/users?page=1&size=10#results"]

    URL --> Scheme["(?<scheme>https?)<br/>'https'"]
    URL --> Sep1["://"]
    URL --> Host["(?<host>[^/:]+)<br/>'www.example.com'"]
    URL --> Port["(?::(?<port>\\d+))?<br/>'8080'"]
    URL --> Path["(?<path>\\/[^\\s?#]*)?<br/>'/api/users'"]
    URL --> Query["(?:\\?(?<query>[^\\s#]*))?<br/>'page=1&size=10'"]
    URL --> Fragment["(?:#(?<fragment>\\S*))?<br/>'results'"]

    style Scheme fill:#e3f2fd,stroke:#2196F3
    style Host fill:#e8f5e9,stroke:#4CAF50
    style Port fill:#fff9c4,stroke:#FFC107
    style Path fill:#fff3e0,stroke:#FF9800
    style Query fill:#f3e5f5,stroke:#9C27B0
    style Fragment fill:#e0f2f1,stroke:#009688
```

---

## IP Address Validation — Octet Decision Tree

```mermaid
flowchart TD
    Octet{Octet value?} -->|"0-9"| R1["[0-9]<br/>Single digit"]
    Octet -->|"10-99"| R2["[1-9][0-9]<br/>Two digits, first non-zero"]
    Octet -->|"100-199"| R3["1[0-9]{2}<br/>Starts with 1"]
    Octet -->|"200-249"| R4["2[0-4][0-9]<br/>Starts with 20-24"]
    Octet -->|"250-255"| R5["25[0-5]<br/>Starts with 25"]
    Octet -->|"256+"| Invalid(["INVALID ✗"])

    R1 & R2 & R3 & R4 & R5 --> Combined["Combined: (?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)"]
    Combined --> Full["Full IPv4: octet\\.octet\\.octet\\.octet<br/>(?:octet\\.){3}octet"]

    style Invalid fill:#ffcdd2,stroke:#f44336
    style Combined fill:#e8f5e9,stroke:#4CAF50
```

---

## Log File Parsing — Extraction Flow

```mermaid
sequenceDiagram
    participant L as Log Line
    participant E as Engine
    participant R as Result

    Note over L: [2024-12-25 10:30:00] [ERROR] DB timeout after 30s

    L->>E: Match \\[
    E->>E: (?<timestamp>\\d{4}-...) captures "2024-12-25 10:30:00"
    L->>E: Match \\]\\s+\\[
    E->>E: (?<level>\\w+) captures "ERROR"
    L->>E: Match \\]\\s+
    E->>E: (?<message>.+) captures "DB timeout after 30s"

    E->>R: groups.timestamp = "2024-12-25 10:30:00"
    E->>R: groups.level = "ERROR"
    E->>R: groups.message = "DB timeout after 30s"

    Note over R: Ready for filtering, alerting, analytics
```

---

## CSV Parsing — Handling Quoted Fields

```mermaid
flowchart TD
    Start["CSV Field"] --> Type{Starts with<br/>quote?}

    Type -->|"No"| Unquoted["Read until comma or end<br/>[^,\"]*<br/>Example: John"]
    Type -->|"Yes"| Quoted["Read between quotes<br/>Handle escaped quotes \"\"<br/>Example: \"Smith, Jr.\""]

    Quoted --> EscQ{Contains \"\"<br/>escaped quotes?}
    EscQ -->|"Yes"| Unescape["Replace \"\" with \"<br/>\"He said \"\"hello\"\"\"<br/>→ He said \"hello\""]
    EscQ -->|"No"| Done

    Unquoted --> Done["Field extracted"]
    Unescape --> Done

    style Unquoted fill:#e3f2fd,stroke:#2196F3
    style Quoted fill:#fff9c4,stroke:#FFC107
    style Unescape fill:#fff3e0,stroke:#FF9800
```

---

## Template Engine — Mustache-Style Parsing

```mermaid
sequenceDiagram
    participant T as Template
    participant E as Regex Engine
    participant D as Data Map
    participant R as Result

    Note over T: "Hello {{user.name}}, order {{orderId}} is {{status}}"
    Note over D: { "user.name": "Alice", "orderId": "12345", "status": "shipped" }

    T->>E: Find all {{...}} patterns

    E->>E: Match "{{user.name}}" at index 6
    E->>D: Lookup "user.name"
    D-->>E: "Alice"
    E->>R: Replace with "Alice"

    E->>E: Match "{{orderId}}" at index 25
    E->>D: Lookup "orderId"
    D-->>E: "12345"
    E->>R: Replace with "12345"

    E->>E: Match "{{status}}" at index 41
    E->>D: Lookup "status"
    D-->>E: "shipped"
    E->>R: Replace with "shipped"

    R-->>T: "Hello Alice, order 12345 is shipped"
```

---

## Semantic Version Parsing

```mermaid
flowchart LR
    Input["3.2.1-beta.1+build.456"]

    Input --> Major["(?<major>\\d+)<br/>'3'"]
    Major --> Dot1["\\."]
    Dot1 --> Minor["(?<minor>\\d+)<br/>'2'"]
    Minor --> Dot2["\\."]
    Dot2 --> Patch["(?<patch>\\d+)<br/>'1'"]
    Patch --> Pre["(?:-(?<pre>[...]))?<br/>'beta.1'"]
    Pre --> Build["(?:\\+(?<build>[...]))?<br/>'build.456'"]

    subgraph Required
        Major
        Minor
        Patch
    end

    subgraph Optional
        Pre
        Build
    end

    style Required fill:#e3f2fd,stroke:#2196F3
    style Optional fill:#fff9c4,stroke:#FFC107
```

---

## Connection String Parsing — Key-Value Extraction

```mermaid
flowchart LR
    Input["Server=myserver;Database=mydb;User Id=admin;Password=s3cret;"]

    Input --> M1["Match 1:<br/>key='Server'<br/>value='myserver'"]
    Input --> M2["Match 2:<br/>key='Database'<br/>value='mydb'"]
    Input --> M3["Match 3:<br/>key='User Id'<br/>value='admin'"]
    Input --> M4["Match 4:<br/>key='Password'<br/>value='s3cret'"]

    M1 & M2 & M3 & M4 --> Map["Config Object:<br/>{<br/>  Server: 'myserver',<br/>  Database: 'mydb',<br/>  'User Id': 'admin',<br/>  Password: 's3cret'<br/>}"]

    style Map fill:#e8f5e9,stroke:#4CAF50
```

---

## Use Case Decision Guide — When to Use Regex

```mermaid
flowchart TD
    Q1{What operation<br/>do you need?}

    Q1 -->|"Simple string check"| Q2{Is the search<br/>pattern fixed?}
    Q1 -->|"Pattern matching"| UseRegex["USE REGEX ✓"]
    Q1 -->|"Text extraction"| UseRegex
    Q1 -->|"Validation"| Q3{How complex<br/>is the rule?}
    Q1 -->|"Search & replace"| Q4{Is the search<br/>pattern-based?}

    Q2 -->|"Yes - fixed string"| UseString["USE STRING METHODS<br/>contains(), startsWith(),<br/>indexOf()"]
    Q2 -->|"No - pattern needed"| UseRegex

    Q3 -->|"Simple format check"| UseRegex
    Q3 -->|"Complex business rules<br/>(date ranges, checksums)"| UseBoth["REGEX + CODE<br/>Regex for format,<br/>code for logic"]

    Q4 -->|"Yes"| UseRegex
    Q4 -->|"No - literal replacement"| UseString2["USE STRING METHODS<br/>replace(), replaceAll()"]

    style UseRegex fill:#e8f5e9,stroke:#4CAF50
    style UseString fill:#e3f2fd,stroke:#2196F3
    style UseString2 fill:#e3f2fd,stroke:#2196F3
    style UseBoth fill:#fff9c4,stroke:#FFC107
```
