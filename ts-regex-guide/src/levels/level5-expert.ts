import { section, note, showExample, showReplace } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 5: EXPERT — Named Groups, Unicode, and Advanced Techniques
//
// What you'll learn:
//   - Named capturing groups: (?<name>pattern)
//   - Named backreferences: \k<name>
//   - Unicode support: /u flag, \p{} Unicode property escapes
//   - Unicode sets: /v flag (ES2024)
//   - Replace with function callbacks
//   - String.raw for readable patterns
//   - Recursive-style matching techniques
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 5.1  NAMED CAPTURING GROUPS
  // ──────────────────────────────────────────────────────────────────
  section("5.1 Named Capturing Groups — (?<name>pattern)");

  note("Named groups make patterns more readable and maintainable.");
  note("Access by name: match.groups.name or match.groups['name']");

  showExample(
    "Parse a date with named groups",
    /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g,
    "Today is 2024-12-25"
  );

  // Demonstrate accessing named groups programmatically
  console.log("  ▸ Accessing named groups in code:");
  const dateMatch = "2024-12-25".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
  if (dateMatch?.groups) {
    console.log(`    Year  = ${dateMatch.groups.year}`);
    console.log(`    Month = ${dateMatch.groups.month}`);
    console.log(`    Day   = ${dateMatch.groups.day}`);
  }
  console.log();

  // Destructuring named groups
  console.log("  ▸ Destructuring named groups (clean syntax):");
  const { groups: { year, month, day } = {} } =
    "2024-12-25".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/) ?? {};
  console.log(`    const { groups: { year, month, day } } = "2024-12-25".match(pattern);`);
  console.log(`    year=${year}, month=${month}, day=${day}`);
  console.log();

  // Named backreference
  showExample(
    "Named backreference \\k<word> — Find duplicate words",
    /\b(?<word>\w+)\s+\k<word>\b/g,
    "This is is a repeated repeated test"
  );

  // Named groups in replacements
  showReplace(
    "Use $<name> in replacement strings",
    /(?<first>\w+)\s+(?<last>\w+)/,
    "John Smith",
    "$<last>, $<first>"
  );

  // ──────────────────────────────────────────────────────────────────
  // 5.2  UNICODE SUPPORT — /u FLAG
  // ──────────────────────────────────────────────────────────────────
  section("5.2 Unicode Support — The /u Flag");

  note("The 'u' flag enables full Unicode matching and \\p{} property escapes.");

  // Without /u, emoji and astral plane characters don't work correctly
  console.log("  ▸ Without /u flag — emoji is treated as two code units:");
  console.log(`    "😀".match(/./) = "${("😀".match(/./) ?? [""])[0]}" (broken — partial match)`);
  console.log(`    "😀".length = ${"😀".length} (two UTF-16 code units)`);
  console.log();

  console.log("  ▸ With /u flag — emoji is treated as one character:");
  console.log(`    "😀".match(/./u) = "${("😀".match(/./u) ?? [""])[0]}" (correct)`);
  console.log();

  // Unicode property escapes
  section("5.2b Unicode Property Escapes — \\p{...} (requires /u flag)");

  showExample(
    "\\p{Letter} — Match any Unicode letter",
    /\p{Letter}+/gu,
    "Hello Мир 世界 مرحبا"
  );

  showExample(
    "\\p{Script=Greek} — Match Greek characters",
    /\p{Script=Greek}+/gu,
    "Hello Ωmega αβγ world"
  );

  showExample(
    "\\p{Emoji} — Match emoji characters",
    /\p{Emoji}/gu,
    "Hello 😀 World 🌍 TypeScript 🚀"
  );

  showExample(
    "\\p{Number} — Match any Unicode number",
    /\p{Number}+/gu,
    "Latin 123 Arabic ١٢٣ Roman Ⅳ"
  );

  showExample(
    "\\P{ASCII} — Match non-ASCII characters (uppercase P = negation)",
    /\P{ASCII}+/gu,
    "Hello café résumé naïve"
  );

  note("Common Unicode categories: Letter, Number, Punctuation, Symbol, Separator, Mark");

  // ──────────────────────────────────────────────────────────────────
  // 5.3  UNICODE SETS — /v FLAG (ES2024)
  // ──────────────────────────────────────────────────────────────────
  section("5.3 Unicode Sets — The /v Flag (ES2024)");

  note("The 'v' flag is an upgrade of 'u' — enables set operations inside [...].");
  note("Supports: intersection (&&), subtraction (--), nested classes.");

  // Set subtraction: match letters but not vowels
  showExample(
    "[\\p{Letter}--[aeiouAEIOU]] — Letters minus vowels",
    /[\p{Letter}--[aeiouAEIOU]]+/gv,
    "Hello World"
  );

  // Set intersection: match characters that are both ASCII and digits
  showExample(
    "[\\p{ASCII}&&\\p{Number}] — ASCII digits only",
    /[\p{ASCII}&&\p{Number}]+/gv,
    "Latin 123 Arabic ١٢٣"
  );

  // String literals in character classes (v flag feature)
  showExample(
    "Match specific multi-character sequences in [...]",
    /[\\q{abc|def|ghi}]/gv,
    "a b c d e f abc def ghi"
  );

  // ──────────────────────────────────────────────────────────────────
  // 5.4  REPLACE WITH FUNCTION CALLBACKS
  // ──────────────────────────────────────────────────────────────────
  section("5.4 Replace with Function Callbacks — Dynamic replacements");

  // Double every number
  console.log("  ▸ Double every number in a string:");
  const input1 = "I have 3 cats and 5 dogs and 12 fish";
  const result1 = input1.replace(/\d+/g, (match) => {
    return (parseInt(match) * 2).toString();
  });
  console.log(`    Input  : "${input1}"`);
  console.log(`    Result : "${result1}"`);
  console.log();

  // Title case
  console.log("  ▸ Convert to Title Case:");
  const input2 = "the quick brown fox jumps over the lazy dog";
  const result2 = input2.replace(/\b\w/g, (match) => match.toUpperCase());
  console.log(`    Input  : "${input2}"`);
  console.log(`    Result : "${result2}"`);
  console.log();

  // Callback with groups
  console.log("  ▸ Replace callback with named groups:");
  const input3 = "2024-12-25 and 2024-01-01";
  const result3 = input3.replace(
    /(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/g,
    (_match, _p1, _p2, _p3, _offset, _str, groups) => {
      return `${groups.m}/${groups.d}/${groups.y}`;
    }
  );
  console.log(`    Input  : "${input3}"`);
  console.log(`    Result : "${result3}"`);
  console.log();

  note("Callback signature: (match, p1, p2, ..., offset, string, groups) => replacement");

  // Mask sensitive data
  console.log("  ▸ Mask credit card numbers:");
  const input4 = "Card: 4111-1111-1111-1111, Alt: 5500-0000-0000-0004";
  const result4 = input4.replace(
    /\d{4}-\d{4}-\d{4}-(\d{4})/g,
    (_match, last4) => `****-****-****-${last4}`
  );
  console.log(`    Input  : "${input4}"`);
  console.log(`    Result : "${result4}"`);
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 5.5  STRING.RAW FOR READABLE PATTERNS
  // ──────────────────────────────────────────────────────────────────
  section("5.5 String.raw + new RegExp() for readable patterns");

  note("Use String.raw to avoid double-escaping in new RegExp() constructor.");

  console.log("  ▸ Without String.raw (must double-escape):");
  console.log('    new RegExp("\\\\d+\\\\.\\\\d+")  // messy');
  console.log();

  console.log("  ▸ With String.raw (single escape, like literal syntax):");
  console.log('    new RegExp(String.raw`\\d+\\.\\d+`)  // clean');
  console.log();

  const rawRegex = new RegExp(String.raw`\d+\.\d+`, "g");
  const rawResult = "Price: 19.99 and 5.50".match(rawRegex);
  console.log(`    Result: [${rawResult?.map((r) => `"${r}"`).join(", ")}]`);
  console.log();

  // Building patterns dynamically
  console.log("  ▸ Building patterns dynamically with template literals:");
  const allowedExtensions = ["jpg", "png", "gif", "webp"];
  const extPattern = new RegExp(
    String.raw`\.(?:${allowedExtensions.join("|")})$`,
    "i"
  );
  console.log(`    Pattern: ${extPattern}`);
  console.log(`    "photo.jpg" : ${extPattern.test("photo.jpg")}`);
  console.log(`    "doc.pdf"   : ${extPattern.test("doc.pdf")}`);
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 5.6  REGEX AND ITERATORS — Symbol.matchAll, Symbol.replace, etc.
  // ──────────────────────────────────────────────────────────────────
  section("5.6 Well-Known Symbols — Customize regex behavior");

  note("JavaScript uses Symbol.match, Symbol.replace, Symbol.search, Symbol.split");
  note("to allow objects to behave like regex in string methods.");

  // Custom matcher object
  console.log("  ▸ Custom matcher using Symbol.match:");

  const vowelMatcher = {
    [Symbol.match](str: string) {
      return str.match(/[aeiou]/gi);
    },
  };

  // @ts-expect-error — custom Symbol.match object
  const vowels = "Hello World".match(vowelMatcher);
  console.log(`    "Hello World".match(vowelMatcher) = [${vowels?.join(", ")}]`);
  console.log();

  // Custom replacer
  console.log("  ▸ Custom replacer using Symbol.replace:");

  const censor = {
    [Symbol.replace](str: string, replacement: string) {
      return str.replace(/[aeiou]/gi, replacement);
    },
  };

  // @ts-expect-error — custom Symbol.replace object
  const censored = "Hello World".replace(censor, "*");
  console.log(`    "Hello World".replace(censor, "*") = "${censored}"`);
  console.log();
}
