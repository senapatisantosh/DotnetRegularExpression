# .NET Regular Expressions - Complete Learning Guide

A comprehensive, step-by-step guide to mastering regular expressions in .NET, from absolute beginner to expert level. Every concept is demonstrated with runnable code examples and clear explanations.

## Quick Start

```bash
cd src/RegexLearningGuide
dotnet run                # Run all levels
dotnet run -- 1           # Run only Level 1
dotnet run -- 1 2 3       # Run specific levels
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later

## Learning Path

### Level 1: Beginner - First Steps with Regex
**File:** [`Levels/Level1_Beginner.cs`](src/RegexLearningGuide/Levels/Level1_Beginner.cs)

| Topic | Description |
|-------|-------------|
| Literal Matching | Search for exact text in strings |
| `Regex.IsMatch()` | Check if a pattern exists (returns `true`/`false`) |
| `Regex.Match()` | Find the first occurrence of a pattern |
| `Regex.Matches()` | Find all occurrences of a pattern |
| The Dot `.` | Match any single character (except newline) |
| `\d` `\w` `\s` | Shorthand character classes (digit, word, space) |
| `\D` `\W` `\S` | Negated shorthands (non-digit, non-word, non-space) |
| Escaping `\.` `\$` | Match special characters literally |
| Static vs Instance | When to use `Regex.IsMatch()` vs `new Regex()` |

---

### Level 2: Elementary - Character Classes & Quantifiers
**File:** [`Levels/Level2_Elementary.cs`](src/RegexLearningGuide/Levels/Level2_Elementary.cs)

| Topic | Description |
|-------|-------------|
| `[abc]` | Match one character from a set |
| `[a-z]` `[0-9]` | Character ranges |
| `[^abc]` | Negated character class (match anything NOT in set) |
| `*` | Zero or more (greedy) |
| `+` | One or more (greedy) |
| `?` | Zero or one (optional) |
| `{n}` `{n,}` `{n,m}` | Exact, minimum, and range quantifiers |
| Greedy vs Lazy | `.*` (greedy) vs `.*?` (lazy) — critical concept! |
| `Regex.Replace()` | Search and replace with patterns |
| `Regex.Split()` | Split strings using regex patterns |

---

### Level 3: Intermediate - Groups, Anchors & Alternation
**File:** [`Levels/Level3_Intermediate.cs`](src/RegexLearningGuide/Levels/Level3_Intermediate.cs)

| Topic | Description |
|-------|-------------|
| `^` `$` | Start and end of string anchors |
| `\b` `\B` | Word boundary and non-word boundary |
| Multiline mode | `^` and `$` match each line with `RegexOptions.Multiline` |
| `(pattern)` | Capturing groups — extract parts of a match |
| `(?:pattern)` | Non-capturing groups — group without capturing |
| `a\|b` | Alternation — match this OR that |
| `$1` `$2` in Replace | Reference captured groups in replacement strings |
| `\1` `\2` | Backreferences — match previously captured text |

---

### Level 4: Advanced - Lookahead, Lookbehind & More
**File:** [`Levels/Level4_Advanced.cs`](src/RegexLearningGuide/Levels/Level4_Advanced.cs)

| Topic | Description |
|-------|-------------|
| `(?=pattern)` | Positive lookahead — assert what comes after |
| `(?!pattern)` | Negative lookahead — assert what must NOT come after |
| `(?<=pattern)` | Positive lookbehind — assert what comes before |
| `(?<!pattern)` | Negative lookbehind — assert what must NOT come before |
| Combined lookarounds | Extract text between delimiters, number formatting |
| Password validation | Real-world use of multiple lookaheads |
| `(?i)` `(?m)` `(?s)` | Inline options — embed regex flags in the pattern |
| `(?(cond)yes\|no)` | Conditional matching |
| `(?>pattern)` | Atomic groups — prevent backtracking |

---

### Level 5: Expert - Named Groups, Balancing Groups & Compilation
**File:** [`Levels/Level5_Expert.cs`](src/RegexLearningGuide/Levels/Level5_Expert.cs)

| Topic | Description |
|-------|-------------|
| `(?<name>pattern)` | Named capturing groups for readable patterns |
| `\k<name>` | Named backreferences |
| `${name}` in Replace | Named group references in replacements |
| Balancing Groups | Match nested structures like `((()))` — unique to .NET! |
| `MatchEvaluator` | Dynamic replacements using delegates |
| `RegexOptions.Compiled` | IL compilation for faster repeated matching |
| `[GeneratedRegex]` | Source-generated regex (.NET 7+) — zero runtime cost |
| `Regex` timeout | Prevent catastrophic backtracking on untrusted input |

---

### Level 6: Master - Real-World Patterns & Performance
**File:** [`Levels/Level6_Master.cs`](src/RegexLearningGuide/Levels/Level6_Master.cs)

| Topic | Description |
|-------|-------------|
| Email validation | Practical email pattern with edge cases |
| URL parsing | Extract scheme, host, port, path, query, fragment |
| IP address validation | IPv4 with proper 0-255 octet validation |
| Log file parsing | Parse structured log entries with named groups |
| CSV parsing | Handle quoted fields and escaped quotes |
| Connection strings | Parse key=value semicolon-delimited data |
| Semantic versioning | Parse semver strings with optional pre-release/build |
| Performance benchmark | Compare static, compiled, and instance regex speeds |
| 8 best practices | Reuse, compile, timeout, avoid pitfalls |
| Verbose patterns | `(?x)` mode with comments for readable complex patterns |

---

## Regex Quick Reference

### Metacharacters
| Char | Meaning |
|------|---------|
| `.` | Any character (except newline by default) |
| `^` | Start of string/line |
| `$` | End of string/line |
| `\|` | Alternation (OR) |
| `\` | Escape next character |

### Character Classes
| Pattern | Matches |
|---------|---------|
| `[abc]` | a, b, or c |
| `[^abc]` | NOT a, b, or c |
| `[a-z]` | a through z |
| `\d` | Digit `[0-9]` |
| `\D` | Non-digit `[^0-9]` |
| `\w` | Word char `[a-zA-Z0-9_]` |
| `\W` | Non-word char |
| `\s` | Whitespace `[ \t\n\r\f]` |
| `\S` | Non-whitespace |

### Quantifiers
| Pattern | Meaning |
|---------|---------|
| `*` | 0 or more (greedy) |
| `+` | 1 or more (greedy) |
| `?` | 0 or 1 (optional) |
| `{n}` | Exactly n |
| `{n,}` | n or more |
| `{n,m}` | Between n and m |
| `*?` `+?` `??` | Lazy versions |

### Groups & Assertions
| Pattern | Meaning |
|---------|---------|
| `(pattern)` | Capturing group |
| `(?:pattern)` | Non-capturing group |
| `(?<name>pattern)` | Named group |
| `\1` or `\k<name>` | Backreference |
| `(?=pattern)` | Positive lookahead |
| `(?!pattern)` | Negative lookahead |
| `(?<=pattern)` | Positive lookbehind |
| `(?<!pattern)` | Negative lookbehind |
| `(?>pattern)` | Atomic group |

### .NET Regex Options
| Option | Effect |
|--------|--------|
| `RegexOptions.IgnoreCase` | Case-insensitive matching |
| `RegexOptions.Multiline` | `^`/`$` match line boundaries |
| `RegexOptions.Singleline` | `.` matches `\n` too |
| `RegexOptions.IgnorePatternWhitespace` | Allow comments with `#` |
| `RegexOptions.Compiled` | Compile to IL for speed |
| `RegexOptions.NonBacktracking` | .NET 7+ linear-time engine |

## Project Structure

```
DotnetRegularExpression/
├── README.md
├── DotnetRegularExpression.sln
└── src/
    └── RegexLearningGuide/
        ├── RegexLearningGuide.csproj
        ├── Program.cs                      # Entry point with level selector
        ├── Helpers/
        │   └── DemoHelper.cs               # Utility for displaying results
        └── Levels/
            ├── Level1_Beginner.cs          # Literals, IsMatch, Match, Matches
            ├── Level2_Elementary.cs        # Character classes, quantifiers
            ├── Level3_Intermediate.cs      # Groups, anchors, alternation
            ├── Level4_Advanced.cs          # Lookarounds, atomic groups
            ├── Level5_Expert.cs            # Named/balancing groups, compilation
            └── Level6_Master.cs            # Real-world patterns, performance
```

## License

This project is for educational purposes. Feel free to use and modify.
