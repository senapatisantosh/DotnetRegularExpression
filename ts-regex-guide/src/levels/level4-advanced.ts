import { section, note, showExample, showTest, showReplace } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 4: ADVANCED — Lookahead, Lookbehind, and Modern Flags
//
// What you'll learn:
//   - Positive lookahead:  (?=pattern)
//   - Negative lookahead:  (?!pattern)
//   - Positive lookbehind: (?<=pattern)
//   - Negative lookbehind: (?<!pattern)
//   - Combined lookarounds
//   - The sticky flag (y)
//   - The dotAll flag (s)
//   - The hasIndices flag (d) — ES2022
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 4.1  POSITIVE LOOKAHEAD — (?=pattern)
  // ──────────────────────────────────────────────────────────────────
  section("4.1 Positive Lookahead (?=...) — Assert what comes AFTER");

  showExample(
    "\\w+(?=\\.) — Match a word only if followed by a dot",
    /\w+(?=\.)/g,
    "end. start middle. done"
  );

  showExample(
    "\\d+(?= dollars) — Match a number only if followed by ' dollars'",
    /\d+(?= dollars)/g,
    "I have 100 dollars and 50 euros"
  );

  note("Lookaheads don't consume characters — the text after is NOT part of the match.");

  // ──────────────────────────────────────────────────────────────────
  // 4.2  NEGATIVE LOOKAHEAD — (?!pattern)
  // ──────────────────────────────────────────────────────────────────
  section("4.2 Negative Lookahead (?!...) — Assert what must NOT come after");

  showExample(
    "\\b\\d+\\b(?! dollars) — Match numbers NOT followed by ' dollars'",
    /\b\d+\b(?! dollars)/g,
    "I have 100 dollars and 50 euros"
  );

  showExample(
    "\\b\\w+\\b(?!\\.) — Match words NOT followed by a dot",
    /\b\w+\b(?!\.)/g,
    "end. start middle. done"
  );

  // Password validation — multiple lookaheads
  section("4.2b Password Validation with Multiple Lookaheads");

  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%]).{8,}$/;
  note("Pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$/");
  note("Requires: 1 uppercase, 1 lowercase, 1 digit, 1 special char, min 8 chars");

  showTest("Weak password", passwordPattern, "password");
  showTest("No special char", passwordPattern, "Password1");
  showTest("Strong password", passwordPattern, "P@ssw0rd!");

  // ──────────────────────────────────────────────────────────────────
  // 4.3  POSITIVE LOOKBEHIND — (?<=pattern)
  // ──────────────────────────────────────────────────────────────────
  section("4.3 Positive Lookbehind (?<=...) — Assert what comes BEFORE");

  showExample(
    "(?<=\\$)\\d+ — Match digits only if preceded by $",
    /(?<=\$)\d+/g,
    "Price: $100, Quantity: 50"
  );

  showExample(
    "(?<=@)\\w+ — Match domain name after @ in email",
    /(?<=@)\w+/g,
    "user@example.com admin@test.org"
  );

  // ──────────────────────────────────────────────────────────────────
  // 4.4  NEGATIVE LOOKBEHIND — (?<!pattern)
  // ──────────────────────────────────────────────────────────────────
  section("4.4 Negative Lookbehind (?<!...) — Assert what must NOT come before");

  showExample(
    "(?<!\\$)\\b\\d+\\b — Match numbers NOT preceded by $",
    /(?<!\$)\b\d+\b/g,
    "Price: $100, Quantity: 50, Tax: $8"
  );

  showExample(
    "(?<!un)happy — Match 'happy' only when NOT preceded by 'un'",
    /(?<!un)happy/g,
    "I am happy but he is unhappy"
  );

  // ──────────────────────────────────────────────────────────────────
  // 4.5  COMBINING LOOKAROUNDS
  // ──────────────────────────────────────────────────────────────────
  section("4.5 Combining Lookarounds");

  showExample(
    "Extract text between parentheses (without the parentheses)",
    /(?<=\().*?(?=\))/g,
    "Call (555-1234) or (800-5678)"
  );

  // Number formatting with lookarounds
  showReplace(
    "Format number with commas: 1234567890 -> 1,234,567,890",
    /(?<=\d)(?=(\d{3})+\b)/g,
    "1234567890",
    ","
  );

  // ──────────────────────────────────────────────────────────────────
  // 4.6  THE STICKY FLAG (y)
  // ──────────────────────────────────────────────────────────────────
  section("4.6 The Sticky Flag (/y) — Match only at lastIndex");

  note("The 'y' flag forces the regex to match ONLY at the current lastIndex position.");
  note("Useful for building tokenizers/lexers.");

  const stickyRegex = /\d+/y;
  const stickyInput = "123abc456";

  console.log(`  ▸ Sticky regex /\\d+/y on "${stickyInput}":`);
  console.log(`    lastIndex=0, exec() = "${stickyRegex.exec(stickyInput)?.[0]}" (matches "123")`);
  console.log(`    lastIndex=${stickyRegex.lastIndex}, exec() = ${stickyRegex.exec(stickyInput)} (fails — "abc" at position 3)`);
  stickyRegex.lastIndex = 6;
  console.log(`    lastIndex=6, exec() = "${stickyRegex.exec(stickyInput)?.[0]}" (matches "456")`);
  console.log();

  // Simple tokenizer example
  console.log("  ▸ Simple tokenizer using sticky flag:");
  const tokenPattern = /\s*(?:(?<number>\d+)|(?<word>[a-zA-Z]+)|(?<op>[+\-*/=]))\s*/y;
  const expression = "x = 42 + y * 3";
  const tokens: { type: string; value: string }[] = [];

  let tokenMatch: RegExpExecArray | null;
  while ((tokenMatch = tokenPattern.exec(expression)) !== null) {
    if (tokenMatch.groups) {
      for (const [type, value] of Object.entries(tokenMatch.groups)) {
        if (value !== undefined) {
          tokens.push({ type, value });
        }
      }
    }
  }
  console.log(`    Input: "${expression}"`);
  console.log(`    Tokens: ${JSON.stringify(tokens)}`);
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 4.7  THE DOTALL FLAG (s)
  // ──────────────────────────────────────────────────────────────────
  section("4.7 The dotAll Flag (/s) — Dot matches newlines");

  const multiline = "Start\nMiddle\nEnd";

  console.log(`  ▸ Without 's' flag: /.+/ doesn't cross newlines`);
  console.log(`    "${multiline}".match(/.+/) = "${multiline.match(/.+/)?.[0]}"`);
  console.log();

  console.log(`  ▸ With 's' flag: /.+/s crosses newlines`);
  console.log(`    "${multiline}".match(/.+/s) = "${multiline.match(/.+/s)?.[0]}"`);
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 4.8  THE hasIndices FLAG (d) — ES2022
  // ──────────────────────────────────────────────────────────────────
  section("4.8 The hasIndices Flag (/d) — Match position details (ES2022)");

  note("The 'd' flag adds an 'indices' property with start/end positions for each group.");

  const indexRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d;
  const indexMatch = indexRegex.exec("Date: 2024-12-25");

  if (indexMatch?.indices) {
    console.log(`  ▸ Match indices for date pattern:`);
    console.log(`    Full match : [${indexMatch.indices[0]}] -> "${indexMatch[0]}"`);
    console.log(`    Group 1    : [${indexMatch.indices[1]}] -> "${indexMatch[1]}"`);
    console.log(`    Group 2    : [${indexMatch.indices[2]}] -> "${indexMatch[2]}"`);
    console.log(`    Group 3    : [${indexMatch.indices[3]}] -> "${indexMatch[3]}"`);

    if (indexMatch.indices.groups) {
      console.log(`    Named 'year'  : [${indexMatch.indices.groups["year"]}]`);
      console.log(`    Named 'month' : [${indexMatch.indices.groups["month"]}]`);
      console.log(`    Named 'day'   : [${indexMatch.indices.groups["day"]}]`);
    }
  }
  console.log();
}
