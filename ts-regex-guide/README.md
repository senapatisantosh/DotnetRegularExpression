# TypeScript Regular Expressions — Complete Learning Guide

A comprehensive, step-by-step guide to mastering regular expressions in TypeScript/JavaScript, from absolute beginner to expert level. Every concept is demonstrated with runnable code examples and clear explanations.

## Quick Start

```bash
cd ts-regex-guide

# Install dependencies
npm install

# Run with tsx (no build step needed)
npx tsx src/index.ts              # Run all levels
npx tsx src/index.ts 1            # Run only Level 1
npx tsx src/index.ts 1 2 3        # Run specific levels

# Or build and run
npm run build
node dist/index.js
```

## Prerequisites

- [Node.js 20+](https://nodejs.org/) (for ES2024 features like the `/v` flag)
- npm or yarn

## Learning Path

### Level 1: Beginner — First Steps with Regex
**File:** [`src/levels/level1-beginner.ts`](src/levels/level1-beginner.ts)

| Topic | Description |
|-------|-------------|
| Two creation syntaxes | Literal `/pattern/` vs `new RegExp()` |
| `regex.test()` | Check if a pattern exists (returns boolean) |
| `string.match()` | Find first match (no `g`) or all matches (with `g`) |
| `string.matchAll()` | ES2020 iterator of all detailed matches |
| `regex.exec()` | Stateful match iteration (with `g` flag) |
| The Dot `.` | Match any single character (except newline) |
| `\d` `\w` `\s` | Shorthand character classes |
| `\D` `\W` `\S` | Negated shorthands |
| Escaping `\.` `\$` | Match special characters literally |
| Flags overview | `g` `i` `m` `s` `u` `v` `y` `d` |

---

### Level 2: Elementary — Character Classes & Quantifiers
**File:** [`src/levels/level2-elementary.ts`](src/levels/level2-elementary.ts)

| Topic | Description |
|-------|-------------|
| `[abc]` | Match one character from a set |
| `[a-z]` `[0-9]` | Character ranges |
| `[^abc]` | Negated character class |
| `*` `+` `?` | Zero-or-more, one-or-more, optional |
| `{n}` `{n,}` `{n,m}` | Exact, minimum, and range quantifiers |
| Greedy vs Lazy | `.*` vs `.*?` — critical concept! |
| `string.replace()` | Search and replace with patterns |
| `string.split()` | Split strings using regex patterns |
| `string.search()` | Find position of first match |

---

### Level 3: Intermediate — Groups, Anchors & Alternation
**File:** [`src/levels/level3-intermediate.ts`](src/levels/level3-intermediate.ts)

| Topic | Description |
|-------|-------------|
| `^` `$` | Start and end of string anchors |
| `\b` `\B` | Word boundary and non-word boundary |
| Multiline `/m` | `^` and `$` match line boundaries |
| `(pattern)` | Capturing groups |
| `(?:pattern)` | Non-capturing groups |
| `a\|b` | Alternation (OR) |
| `$1` `$2` in replace | Group references in replacements |
| `\1` `\2` | Backreferences |
| Special replacements | `$&`, `` $` ``, `$'`, `$$` |

---

### Level 4: Advanced — Lookahead, Lookbehind & Modern Flags
**File:** [`src/levels/level4-advanced.ts`](src/levels/level4-advanced.ts)

| Topic | Description |
|-------|-------------|
| `(?=pattern)` | Positive lookahead |
| `(?!pattern)` | Negative lookahead |
| `(?<=pattern)` | Positive lookbehind |
| `(?<!pattern)` | Negative lookbehind |
| Combined lookarounds | Extract between delimiters, number formatting |
| Password validation | Real-world multiple lookahead usage |
| Sticky flag `/y` | Match only at `lastIndex` — build tokenizers |
| dotAll flag `/s` | Make `.` match newlines |
| hasIndices flag `/d` | ES2022 match position details |

---

### Level 5: Expert — Named Groups, Unicode & Advanced Techniques
**File:** [`src/levels/level5-expert.ts`](src/levels/level5-expert.ts)

| Topic | Description |
|-------|-------------|
| `(?<name>pattern)` | Named capturing groups |
| `\k<name>` | Named backreferences |
| `$<name>` in replace | Named group references |
| Destructuring groups | Clean syntax with `match.groups` |
| `/u` flag | Full Unicode support |
| `\p{Letter}` | Unicode property escapes |
| `\p{Script=Greek}` | Script-specific matching |
| `/v` flag (ES2024) | Unicode sets: `&&` intersection, `--` subtraction |
| Function callbacks | Dynamic replacements in `replace()` |
| `String.raw` | Readable patterns with `new RegExp()` |
| Well-known symbols | `Symbol.match`, `Symbol.replace` customization |

---

### Level 6: Master — Real-World Patterns & Performance
**File:** [`src/levels/level6-master.ts`](src/levels/level6-master.ts)

| Topic | Description |
|-------|-------------|
| Email validation | Practical pattern with edge cases |
| URL parsing | Named groups for scheme, host, port, path, query |
| IP address validation | IPv4 with proper 0-255 octet range |
| Log file parsing | Structured log entry extraction |
| Template parsing | Mustache-style `{{variable}}` replacement |
| Connection strings | Key=value parsing |
| Semantic versioning | Semver with optional pre-release/build |
| Performance benchmark | Cached vs new regex vs string methods |
| 8 best practices | Caching, specificity, string methods |
| 6 common pitfalls | `g` flag state, greedy matching, backtracking |

---

## Regex Quick Reference

### Metacharacters
| Char | Meaning |
|------|---------|
| `.` | Any character (except newline, unless `/s`) |
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
| `\d` / `\D` | Digit / Non-digit |
| `\w` / `\W` | Word char / Non-word char |
| `\s` / `\S` | Whitespace / Non-whitespace |
| `\p{Letter}` | Unicode letter (requires `/u` or `/v`) |

### Quantifiers
| Pattern | Meaning |
|---------|---------|
| `*` / `*?` | 0+ greedy / lazy |
| `+` / `+?` | 1+ greedy / lazy |
| `?` / `??` | 0-1 greedy / lazy |
| `{n}` | Exactly n |
| `{n,}` / `{n,}?` | n+ greedy / lazy |
| `{n,m}` / `{n,m}?` | n to m greedy / lazy |

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

### Flags
| Flag | Name | Effect |
|------|------|--------|
| `g` | global | Find all matches |
| `i` | ignoreCase | Case-insensitive |
| `m` | multiline | `^`/`$` match line boundaries |
| `s` | dotAll | `.` matches `\n` |
| `u` | unicode | Full Unicode + `\p{}` escapes |
| `v` | unicodeSets | Set operations in `[...]` (ES2024) |
| `y` | sticky | Match at `lastIndex` only |
| `d` | hasIndices | Include match index details (ES2022) |

### String Methods with Regex
| Method | Description |
|--------|-------------|
| `str.match(rx)` | First match (no `g`) or all strings (with `g`) |
| `str.matchAll(rx)` | Iterator of all detailed matches (requires `g`) |
| `str.replace(rx, rep)` | Replace first (no `g`) or all (with `g`) |
| `str.replaceAll(rx, rep)` | Replace all (requires `g` flag) |
| `str.search(rx)` | Index of first match, or -1 |
| `str.split(rx)` | Split by pattern |
| `rx.test(str)` | Boolean — does it match? |
| `rx.exec(str)` | Next match with details (stateful with `g`) |

## TypeScript vs .NET Regex Differences

| Feature | TypeScript/JS | .NET |
|---------|---------------|------|
| Literal syntax | `/pattern/flags` | `@"pattern"` (verbatim string) |
| Named groups | `(?<name>...)` | `(?<name>...)` (same!) |
| Unicode properties | `\p{Letter}` (with `/u`) | `\p{L}` |
| Verbose/commented | Not supported natively | `(?x)` / `IgnorePatternWhitespace` |
| Balancing groups | Not supported | `(?<name>-<other>)` |
| Compiled regex | N/A (engine optimizes) | `RegexOptions.Compiled` |
| Source generators | N/A | `[GeneratedRegex]` (.NET 7+) |
| Timeout | Not supported | `TimeSpan` parameter |
| Non-backtracking | Not supported | `RegexOptions.NonBacktracking` (.NET 7+) |
| dotAll flag | `/s` flag | `RegexOptions.Singleline` |
| Sticky matching | `/y` flag | No equivalent |
| Match indices | `/d` flag (ES2022) | `Match.Index` property |
| Unicode sets | `/v` flag (ES2024) | Not available |

## Project Structure

```
ts-regex-guide/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                        # Entry point with level selector
    ├── helpers/
    │   └── demo-helper.ts              # Utility for displaying results
    └── levels/
        ├── level1-beginner.ts          # Literals, test, match, exec, matchAll
        ├── level2-elementary.ts        # Character classes, quantifiers
        ├── level3-intermediate.ts      # Groups, anchors, alternation
        ├── level4-advanced.ts          # Lookarounds, sticky, dotAll, indices
        ├── level5-expert.ts            # Named groups, Unicode, /v flag
        └── level6-master.ts            # Real-world patterns, performance
```

## License

This project is for educational purposes. Feel free to use and modify.
