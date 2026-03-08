import { section, note, showTest, showExample } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 1: BEGINNER — First Steps with Regular Expressions in TypeScript
//
// What you'll learn:
//   - What a RegExp is in JavaScript/TypeScript
//   - Two ways to create regex: literal /pattern/ and new RegExp()
//   - regex.test()     — check if a pattern exists (returns boolean)
//   - string.match()   — find matches
//   - regex.exec()     — find a match with full details
//   - string.matchAll() — find all matches (ES2020+)
//   - Literal character matching
//   - The dot (.) metacharacter
//   - Basic escape sequences (\d, \w, \s)
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 1.1  CREATING REGEX — TWO SYNTAXES
  // ──────────────────────────────────────────────────────────────────
  section("1.1 Creating Regular Expressions — Two Syntaxes");

  console.log("  ▸ Literal syntax (preferred when pattern is known at compile time):");
  console.log('    const regex = /pattern/flags;');
  console.log();
  console.log("  ▸ Constructor syntax (for dynamic patterns):");
  console.log('    const regex = new RegExp("pattern", "flags");');
  console.log();

  // Demonstrate both
  const literal = /hello/i;
  const constructed = new RegExp("hello", "i");

  console.log(`    /hello/i.test("Hello World")            = ${literal.test("Hello World")}`);
  console.log(`    new RegExp("hello","i").test("Hello World") = ${constructed.test("Hello World")}`);
  console.log();

  note("Literal syntax: no need to escape backslashes. Constructor: must double-escape (\\\\d instead of \\d).");

  // ──────────────────────────────────────────────────────────────────
  // 1.2  LITERAL MATCHING
  // ──────────────────────────────────────────────────────────────────
  section("1.2 Literal Matching — Searching for exact text");

  showTest(
    "Does the string contain 'cat'?",
    /cat/,
    "The cat sat on the mat"
  );

  showTest(
    "Does the string contain 'dog'?",
    /dog/,
    "The cat sat on the mat"
  );

  note("Regex is case-sensitive by default. Use the 'i' flag for case-insensitive.");

  showTest(
    "Case-sensitive: searching for 'Cat'",
    /Cat/,
    "The cat sat on the mat"
  );

  showTest(
    "Case-insensitive: searching for 'Cat' with /i flag",
    /Cat/i,
    "The cat sat on the mat"
  );

  // ──────────────────────────────────────────────────────────────────
  // 1.3  FOUR ESSENTIAL METHODS
  // ──────────────────────────────────────────────────────────────────
  section("1.3 Four Essential Methods");

  const text = "Order 100 and Order 200 were shipped.";

  // regex.test() — returns true/false
  console.log("  ▸ regex.test() — Does it contain a number?");
  console.log(`    /\\d+/.test("${text}") = ${/\d+/.test(text)}`);
  console.log();

  // string.match() — returns first match (without g flag)
  console.log("  ▸ string.match() — Find the first number (no 'g' flag)");
  const firstMatch = text.match(/\d+/);
  console.log(`    Found: "${firstMatch?.[0]}" at index ${firstMatch?.index}`);
  console.log();

  // string.match() with g flag — returns all matched strings
  console.log("  ▸ string.match(/g) — Find all numbers (with 'g' flag)");
  const allMatches = text.match(/\d+/g);
  console.log(`    Found: [${allMatches?.map((m) => `"${m}"`).join(", ")}]`);
  console.log();

  // string.matchAll() — returns iterator of detailed matches (ES2020+)
  console.log("  ▸ string.matchAll() — All matches with full details (ES2020+)");
  for (const m of text.matchAll(/\d+/g)) {
    console.log(`    Found: "${m[0]}" at index ${m.index}`);
  }
  console.log();

  // regex.exec() — find next match (stateful with g flag)
  console.log("  ▸ regex.exec() — Stateful iteration (with 'g' flag)");
  const execRegex = /\d+/g;
  let execMatch: RegExpExecArray | null;
  while ((execMatch = execRegex.exec(text)) !== null) {
    console.log(`    Found: "${execMatch[0]}" at index ${execMatch.index}, lastIndex=${execRegex.lastIndex}`);
  }
  console.log();

  note("matchAll() is preferred over exec() loops — cleaner and no statefulness issues.");

  // ──────────────────────────────────────────────────────────────────
  // 1.4  THE DOT (.) METACHARACTER
  // ──────────────────────────────────────────────────────────────────
  section("1.4 The Dot (.) — Matches any single character (except newline)");

  showExample(
    "Pattern /c.t/ matches any character between c and t",
    /c.t/g,
    "cat cot cut c t c9t"
  );

  note("The dot does NOT match newline (\\n) by default. Use the 's' (dotAll) flag to change this.");

  // ──────────────────────────────────────────────────────────────────
  // 1.5  SHORTHAND CHARACTER CLASSES
  // ──────────────────────────────────────────────────────────────────
  section("1.5 Shorthand Character Classes");

  // \d = any digit [0-9]
  showExample(
    "\\d — Matches any digit (0-9)",
    /\d/g,
    "Room 42 on Floor 3"
  );

  // \D = any NON-digit
  showExample(
    "\\D+ — Matches any non-digit characters",
    /\D+/g,
    "abc123def456"
  );

  // \w = any word character [a-zA-Z0-9_]
  showExample(
    "\\w+ — Matches word characters (letters, digits, underscore)",
    /\w+/g,
    "hello_world 123 foo-bar"
  );

  // \W = any NON-word character
  showExample(
    "\\W+ — Matches non-word characters",
    /\W+/g,
    "hello world! how are you?"
  );

  // \s = any whitespace
  showExample(
    "\\s — Matches whitespace characters",
    /\s/g,
    "a b\tc"
  );

  // \S = any NON-whitespace
  showExample(
    "\\S+ — Matches non-whitespace characters",
    /\S+/g,
    "Split these words"
  );

  // ──────────────────────────────────────────────────────────────────
  // 1.6  ESCAPING SPECIAL CHARACTERS
  // ──────────────────────────────────────────────────────────────────
  section("1.6 Escaping Special Characters with backslash (\\)");

  note("These characters have special meaning in regex: . * + ? | \\ ^ $ ( ) [ ] { }");
  note("To match them literally, prefix with backslash: \\. \\* \\+ etc.");

  showExample(
    "Match a literal dot in a filename",
    /\w+\.\w+/g,
    "file.txt and image.png are files"
  );

  showExample(
    "Match a literal dollar amount",
    /\$\d+\.\d{2}/g,
    "The price is $19.99 today"
  );

  // ──────────────────────────────────────────────────────────────────
  // 1.7  REGEX FLAGS OVERVIEW
  // ──────────────────────────────────────────────────────────────────
  section("1.7 Regex Flags — Modifiers that change behavior");

  console.log("  Flag | Name                 | Effect");
  console.log("  ─────┼──────────────────────┼──────────────────────────────────");
  console.log("   g   │ global               │ Find ALL matches, not just first");
  console.log("   i   │ ignoreCase           │ Case-insensitive matching");
  console.log("   m   │ multiline            │ ^ and $ match line boundaries");
  console.log("   s   │ dotAll               │ . matches newline too");
  console.log("   u   │ unicode              │ Enable full Unicode matching");
  console.log("   v   │ unicodeSets          │ Extended Unicode sets (ES2024)");
  console.log("   y   │ sticky               │ Match only at lastIndex position");
  console.log("   d   │ hasIndices           │ Include match indices (ES2022)");
  console.log();

  note("Flags are placed after the closing slash: /pattern/gi");
}
