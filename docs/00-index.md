# Regex Learning Guide — Visual Documentation

This folder contains **Mermaid diagrams** that visually explain every regex concept covered in the learning guide. Each document includes flowcharts, sequence diagrams, and state diagrams to help you deeply understand how regular expressions work.

## Table of Contents

| # | Document | Topics |
|---|----------|--------|
| 01 | [Regex Engine Internals](01-regex-engine-internals.md) | How the regex engine works, NFA vs DFA, backtracking, match lifecycle |
| 02 | [Beginner Concepts](02-beginner-concepts.md) | Literal matching, dot metacharacter, shorthand classes, method selection |
| 03 | [Character Classes & Quantifiers](03-character-classes-and-quantifiers.md) | Character sets, ranges, negation, greedy vs lazy, quantifier decision tree |
| 04 | [Groups, Anchors & Alternation](04-groups-anchors-alternation.md) | Capturing groups, non-capturing, anchors, backreferences, alternation |
| 05 | [Lookahead & Lookbehind](05-lookahead-lookbehind.md) | All four lookaround types, password validation, combined lookarounds |
| 06 | [Advanced & Expert Features](06-advanced-expert-features.md) | Named groups, balancing groups, Unicode, compiled regex, source generators |
| 07 | [Real-World Use Cases](07-real-world-use-cases.md) | Email, URL, IP, log parsing, CSV, template engines — full flow diagrams |
| 08 | [Performance & Pitfalls](08-performance-and-pitfalls.md) | Catastrophic backtracking, optimization decision tree, caching strategy |
| 09 | [Method Selection Guide](09-method-selection-guide.md) | Which regex method to use in .NET vs TypeScript for every scenario |
| 10 | [Cheat Sheet — Visual](10-visual-cheat-sheet.md) | Complete regex syntax as visual diagrams |

## How to View Mermaid Diagrams

Mermaid diagrams render natively on:
- **GitHub** — renders in markdown files automatically
- **VS Code** — install the [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) extension
- **Online** — paste into [mermaid.live](https://mermaid.live)
