import { section, note, showExample, showReplace, showSplit } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 2: ELEMENTARY — Character Classes and Quantifiers
//
// What you'll learn:
//   - Character classes [abc], [a-z], [^abc]
//   - Quantifiers: * + ? {n} {n,} {n,m}
//   - Greedy vs Lazy matching
//   - string.replace() with regex
//   - string.split() with regex
//   - string.search() — find position of first match
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 2.1  CHARACTER CLASSES — [...]
  // ──────────────────────────────────────────────────────────────────
  section("2.1 Character Classes — Match one character from a set");

  showExample(
    "[aeiou] — Match any single vowel",
    /[aeiou]/g,
    "Hello World"
  );

  showExample(
    "[a-z]+ — Match lowercase letter sequences",
    /[a-z]+/g,
    "Hello World 123"
  );

  showExample(
    "[A-Za-z]+ — Match any letter sequences",
    /[A-Za-z]+/g,
    "Hello World 123"
  );

  showExample(
    "[0-9]+ — Match digit sequences (same as \\d+)",
    /[0-9]+/g,
    "Invoice #12345"
  );

  // Negated character class
  showExample(
    "[^0-9]+ — Match anything that is NOT a digit",
    /[^0-9]+/g,
    "abc123def456"
  );

  showExample(
    "[^aeiou]+ — Match non-vowel sequences (case-insensitive)",
    /[^aeiou]+/gi,
    "hello world"
  );

  note("Inside [...], most metacharacters lose their special meaning. Only ] \\ ^ - need escaping.");

  // ──────────────────────────────────────────────────────────────────
  // 2.2  QUANTIFIERS
  // ──────────────────────────────────────────────────────────────────
  section("2.2 Quantifiers — How many times to match");

  // * = zero or more
  showExample(
    "ca*t — Zero or more 'a' characters between c and t",
    /ca*t/g,
    "ct cat caat caaat cbt"
  );

  // + = one or more
  showExample(
    "ca+t — One or more 'a' characters",
    /ca+t/g,
    "ct cat caat caaat"
  );

  // ? = zero or one (optional)
  showExample(
    "colou?r — The 'u' is optional",
    /colou?r/g,
    "color and colour are both valid"
  );

  // {n} = exactly n
  showExample(
    "\\d{3} — Exactly 3 digits",
    /\d{3}/g,
    "1 12 123 1234 12345"
  );

  // {n,} = n or more
  showExample(
    "\\d{2,} — 2 or more digits",
    /\d{2,}/g,
    "1 12 123 1234"
  );

  // {n,m} = between n and m
  showExample(
    "\\d{2,4} — Between 2 and 4 digits",
    /\d{2,4}/g,
    "1 12 123 1234 12345"
  );

  // ──────────────────────────────────────────────────────────────────
  // 2.3  GREEDY vs LAZY MATCHING
  // ──────────────────────────────────────────────────────────────────
  section("2.3 Greedy vs Lazy — How much to consume");

  note("By default, quantifiers are GREEDY — they match as much as possible.");
  note("Add '?' after a quantifier to make it LAZY — match as little as possible.");

  showExample(
    'Greedy: ".*" grabs everything between first and LAST quote',
    /".*"/g,
    'He said "hello" and "goodbye"'
  );

  showExample(
    'Lazy: ".*?" grabs between first and NEAREST quote',
    /".*?"/g,
    'He said "hello" and "goodbye"'
  );

  showExample(
    "Greedy: <.+> matches the entire tag content",
    /<.+>/g,
    "<b>bold</b>"
  );

  showExample(
    "Lazy: <.+?> matches individual tags",
    /<.+?>/g,
    "<b>bold</b>"
  );

  // ──────────────────────────────────────────────────────────────────
  // 2.4  string.replace() — SEARCH AND REPLACE
  // ──────────────────────────────────────────────────────────────────
  section("2.4 string.replace() — Search and replace with patterns");

  showReplace(
    "Replace all digits with '#'",
    /\d/g,
    "Phone: 555-1234",
    "#"
  );

  showReplace(
    "Remove extra whitespace (replace 2+ spaces with one)",
    /\s{2,}/g,
    "Too   many     spaces    here",
    " "
  );

  showReplace(
    "Censor words (case-insensitive, global)",
    /darn|heck/gi,
    "Oh darn, what the heck!",
    "****"
  );

  note("Without the 'g' flag, replace() only replaces the FIRST match!");

  // ──────────────────────────────────────────────────────────────────
  // 2.5  string.split() — SPLIT BY PATTERN
  // ──────────────────────────────────────────────────────────────────
  section("2.5 string.split() — Split strings using patterns");

  showSplit(
    "Split on any whitespace",
    /\s+/,
    "Split   these   words   apart"
  );

  showSplit(
    "Split on punctuation",
    /[,;:]+\s*/,
    "one,two;three: four, five"
  );

  showSplit(
    "Split a CSV line (handling optional spaces after comma)",
    /,\s*/,
    "apple, banana, cherry, date"
  );

  showSplit(
    "Split on camelCase boundaries",
    /(?=[A-Z])/,
    "thisIsCamelCaseText"
  );

  // ──────────────────────────────────────────────────────────────────
  // 2.6  string.search() — FIND POSITION
  // ──────────────────────────────────────────────────────────────────
  section("2.6 string.search() — Find position of first match");

  const text = "Hello World 123";

  console.log(`  ▸ Find position of first digit in "${text}":`);
  console.log(`    "${text}".search(/\\d/) = ${text.search(/\d/)}`);
  console.log();

  console.log(`  ▸ Find position of "World":`);
  console.log(`    "${text}".search(/World/) = ${text.search(/World/)}`);
  console.log();

  console.log(`  ▸ Pattern not found returns -1:`);
  console.log(`    "${text}".search(/xyz/) = ${text.search(/xyz/)}`);
  console.log();

  note("search() always returns the index of the FIRST match, ignoring the 'g' flag.");
}
