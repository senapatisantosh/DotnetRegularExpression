import { section, note, showExample, showTest, showReplace } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 3: INTERMEDIATE — Groups, Anchors, and Alternation
//
// What you'll learn:
//   - Anchors: ^ $ \b \B
//   - Capturing groups: (pattern)
//   - Non-capturing groups: (?:pattern)
//   - Alternation: pattern1|pattern2
//   - Backreferences: \1, \2
//   - Replace with captured groups: $1, $2
//   - Multiline mode
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 3.1  ANCHORS
  // ──────────────────────────────────────────────────────────────────
  section("3.1 Anchors — Match positions, not characters");

  // ^ matches the start of the string
  showTest(
    "^ — String starts with 'Hello'",
    /^Hello/,
    "Hello World"
  );

  showTest(
    "^ — 'World' is NOT at the start",
    /^World/,
    "Hello World"
  );

  // $ matches the end of the string
  showTest(
    "$ — String ends with 'World'",
    /World$/,
    "Hello World"
  );

  // \b matches a word boundary
  showExample(
    "\\bcat\\b — Match 'cat' as a whole word only",
    /\bcat\b/g,
    "The cat scattered the catalog"
  );

  note("\\b matches the boundary between a \\w and a \\W character (or start/end of string).");

  // \B matches a NON-word-boundary
  showExample(
    "\\Bcat\\B — Match 'cat' only when NOT a whole word",
    /\Bcat\B/g,
    "The cat scattered the catalog education"
  );

  // ──────────────────────────────────────────────────────────────────
  // 3.1b  MULTILINE MODE
  // ──────────────────────────────────────────────────────────────────
  section("3.1b Multiline Mode — ^ and $ match each line");

  const multiline = "First line\nSecond line\nThird line";

  showExample(
    "Without 'm' flag: ^ only matches start of entire string",
    /^\w+/g,
    multiline
  );

  showExample(
    "With 'm' flag: ^ matches start of each line",
    /^\w+/gm,
    multiline
  );

  // ──────────────────────────────────────────────────────────────────
  // 3.2  CAPTURING GROUPS
  // ──────────────────────────────────────────────────────────────────
  section("3.2 Capturing Groups — Extract parts of a match with (...)");

  showExample(
    "Extract area code and number from phone",
    /\((\d{3})\)\s*(\d{3}-\d{4})/g,
    "Call (555) 123-4567 today!"
  );

  showExample(
    "Extract date parts: (month)/(day)/(year)",
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/g,
    "Date: 12/25/2024"
  );

  showExample(
    "Extract key=value pairs",
    /(\w+)=(\w+)/g,
    "name=John age=30 city=NYC"
  );

  // ──────────────────────────────────────────────────────────────────
  // 3.3  NON-CAPTURING GROUPS
  // ──────────────────────────────────────────────────────────────────
  section("3.3 Non-Capturing Groups — Group without capturing with (?:...)");

  note("Use (?:...) when you need grouping for quantifiers or alternation but don't need the captured value.");

  showExample(
    "Capturing group: (https?) captures the protocol",
    /(https?):\/\/(\w+\.\w+)/g,
    "Visit https://example.com"
  );

  showExample(
    "Non-capturing: (?:https?) groups but doesn't capture",
    /(?:https?):\/\/(\w+\.\w+)/g,
    "Visit https://example.com"
  );

  note("Notice the non-capturing version has one fewer group in the output.");

  // ──────────────────────────────────────────────────────────────────
  // 3.4  ALTERNATION — THE OR OPERATOR
  // ──────────────────────────────────────────────────────────────────
  section("3.4 Alternation — Match this OR that with |");

  showExample(
    "cat|dog — Match either 'cat' or 'dog'",
    /cat|dog/g,
    "I have a cat and a dog"
  );

  showExample(
    "Combine with groups: (Mon|Tues|Wednes)day",
    /(Mon|Tues|Wednes)day/g,
    "Monday Tuesday Wednesday Thursday"
  );

  showExample(
    "File extensions: \\.(jpg|png|gif)$ (case-insensitive)",
    /\.(jpg|png|gif)$/i,
    "photo.jpg"
  );

  // ──────────────────────────────────────────────────────────────────
  // 3.5  REPLACE WITH CAPTURED GROUPS
  // ──────────────────────────────────────────────────────────────────
  section("3.5 Replace with Group References — $1, $2");

  showReplace(
    "Reformat date from MM/DD/YYYY to YYYY-MM-DD",
    /(\d{2})\/(\d{2})\/(\d{4})/g,
    "12/25/2024",
    "$3-$1-$2"
  );

  showReplace(
    "Swap first and last name",
    /(\w+)\s+(\w+)/,
    "John Smith",
    "$2, $1"
  );

  showReplace(
    "Wrap each word in brackets",
    /(\w+)/g,
    "hello world",
    "[$1]"
  );

  note("Special replacement patterns: $1 $2 (groups), $& (full match), $` (before), $' (after), $$ (literal $).");

  // ──────────────────────────────────────────────────────────────────
  // 3.6  BACKREFERENCES — MATCH THE SAME TEXT AGAIN
  // ──────────────────────────────────────────────────────────────────
  section("3.6 Backreferences — Match previously captured text with \\1");

  showExample(
    "Find doubled words: (\\w+)\\s+\\1",
    /\b(\w+)\s+\1\b/g,
    "This is is a test test of doubled words words"
  );

  showExample(
    "Match repeated characters: (.)\\1+",
    /(.)\1+/g,
    "aabbccdddeee hello"
  );

  showExample(
    "Match matching HTML tags: <(\\w+)>.*?<\\/\\1>",
    /<(\w+)>.*?<\/\1>/g,
    "<b>bold</b> and <i>italic</i>"
  );
}
