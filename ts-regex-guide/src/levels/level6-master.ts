import { section, note, showExample, showTest } from "../helpers/demo-helper.js";

// ============================================================================
// LEVEL 6: MASTER — Real-World Patterns and Performance
//
// What you'll learn:
//   - Email validation
//   - URL parsing
//   - IP address matching
//   - Log file parsing
//   - JSON-like key extraction
//   - Template literal parsing
//   - Performance best practices
//   - Common pitfalls and how to avoid them
//   - Catastrophic backtracking
// ============================================================================

export function run(): void {
  // ──────────────────────────────────────────────────────────────────
  // 6.1  EMAIL VALIDATION
  // ──────────────────────────────────────────────────────────────────
  section("6.1 Real-World: Email Validation");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  console.log(`  Pattern: ${emailPattern}`);
  console.log();

  const emails = [
    "user@example.com",
    "first.last@company.co.uk",
    "user+tag@gmail.com",
    "invalid@",
    "@nouser.com",
    "spaces not@allowed.com",
    "user@123.123.123.123",
  ];

  for (const email of emails) {
    const valid = emailPattern.test(email);
    console.log(`    ${email.padEnd(35)} => ${valid ? "VALID" : "INVALID"}`);
  }
  console.log();

  note("For production, consider using a library or the URL constructor for validation.");

  // ──────────────────────────────────────────────────────────────────
  // 6.2  URL PARSING
  // ──────────────────────────────────────────────────────────────────
  section("6.2 Real-World: URL Parsing");

  const urlPattern = /^(?<scheme>https?):\/\/(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>\/[^\s?#]*)?(?:\?(?<query>[^\s#]*))?(?:#(?<fragment>\S*))?$/;

  const urls = [
    "https://www.example.com/path/to/page?name=value&foo=bar#section",
    "http://localhost:8080/api/users",
    "https://example.com",
  ];

  for (const url of urls) {
    const match = url.match(urlPattern);
    if (match?.groups) {
      console.log(`  ▸ URL: ${url}`);
      console.log(`    Scheme   : ${match.groups.scheme}`);
      console.log(`    Host     : ${match.groups.host}`);
      if (match.groups.port) console.log(`    Port     : ${match.groups.port}`);
      if (match.groups.path) console.log(`    Path     : ${match.groups.path}`);
      if (match.groups.query) console.log(`    Query    : ${match.groups.query}`);
      if (match.groups.fragment) console.log(`    Fragment : ${match.groups.fragment}`);
      console.log();
    }
  }

  note("For production URL parsing, use the built-in URL class instead of regex.");

  // ──────────────────────────────────────────────────────────────────
  // 6.3  IP ADDRESS MATCHING
  // ──────────────────────────────────────────────────────────────────
  section("6.3 Real-World: IP Address Validation");

  const ipPattern = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

  const ips = ["192.168.1.1", "10.0.0.1", "255.255.255.255", "256.1.1.1", "1.2.3", "1.2.3.4.5"];

  for (const ip of ips) {
    const valid = ipPattern.test(ip);
    console.log(`    ${ip.padEnd(20)} => ${valid ? "VALID" : "INVALID"}`);
  }
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 6.4  LOG FILE PARSING
  // ──────────────────────────────────────────────────────────────────
  section("6.4 Real-World: Log File Parsing");

  const logPattern = /^\[(?<timestamp>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})]\s+\[(?<level>\w+)]\s+(?<message>.+)$/;

  const logLines = [
    "[2024-12-25 10:30:00] [INFO] Application started successfully",
    "[2024-12-25 10:30:05] [WARN] Configuration file not found, using defaults",
    "[2024-12-25 10:30:10] [ERROR] Failed to connect to database: timeout after 30s",
  ];

  for (const line of logLines) {
    const match = line.match(logPattern);
    if (match?.groups) {
      console.log(`  ▸ Timestamp : ${match.groups.timestamp}`);
      console.log(`    Level     : ${match.groups.level}`);
      console.log(`    Message   : ${match.groups.message}`);
      console.log();
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // 6.5  TEMPLATE LITERAL / MUSTACHE PARSING
  // ──────────────────────────────────────────────────────────────────
  section("6.5 Real-World: Template String Parsing");

  const templatePattern = /\{\{(?<key>\w+(?:\.\w+)*)}}/g;
  const template = "Hello {{user.name}}, your order {{orderId}} is {{status}}.";

  console.log(`  ▸ Template: "${template}"`);
  console.log("    Placeholders found:");

  for (const match of template.matchAll(templatePattern)) {
    console.log(`      {{${match.groups?.key}}} at index ${match.index}`);
  }
  console.log();

  // Template replacement
  const data: Record<string, string> = {
    "user.name": "Alice",
    orderId: "12345",
    status: "shipped",
  };

  const rendered = template.replace(templatePattern, (_match, key: string) => data[key] ?? _match);
  console.log(`    Rendered: "${rendered}"`);
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 6.6  EXTRACTING DATA FROM STRUCTURED TEXT
  // ──────────────────────────────────────────────────────────────────
  section("6.6 Real-World: Extract data from structured text");

  // Parse a connection string / config
  const connString = "Server=myserver;Database=mydb;User Id=admin;Password=secret123;Timeout=30;";
  const connPattern = /(?<key>[^=;]+)=(?<value>[^;]+)/g;

  console.log(`  ▸ Config string: ${connString}`);
  console.log("    Parsed key-value pairs:");
  for (const match of connString.matchAll(connPattern)) {
    if (match.groups) {
      console.log(`      ${match.groups.key.padEnd(12)} = ${match.groups.value}`);
    }
  }
  console.log();

  // Parse semantic version
  const semverPattern = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<prerelease>[a-zA-Z0-9.]+))?(?:\+(?<build>[a-zA-Z0-9.]+))?$/;

  const versions = ["1.0.0", "2.3.1-beta.1", "3.0.0-rc.1+build.123"];

  console.log("  ▸ Semantic version parsing:");
  for (const ver of versions) {
    const match = ver.match(semverPattern);
    if (match?.groups) {
      let output = `    ${ver.padEnd(30)} => Major=${match.groups.major}`;
      output += `, Minor=${match.groups.minor}`;
      output += `, Patch=${match.groups.patch}`;
      if (match.groups.prerelease) output += `, Pre=${match.groups.prerelease}`;
      if (match.groups.build) output += `, Build=${match.groups.build}`;
      console.log(output);
    }
  }
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 6.7  PERFORMANCE BEST PRACTICES
  // ──────────────────────────────────────────────────────────────────
  section("6.7 Performance Best Practices");

  console.log("  1. CACHE regex instances — don't create new ones in loops");
  console.log("     BAD:  for(...) { str.match(new RegExp(pattern)); }");
  console.log("     GOOD: const rx = /pattern/g;");
  console.log("           for(...) { rx.lastIndex = 0; rx.test(str); }");
  console.log();

  console.log("  2. Use literal syntax /pattern/ over new RegExp() when possible");
  console.log("     Engine can optimize literal regex at parse time.");
  console.log();

  console.log("  3. Be specific — avoid .* when you can use [^x]*");
  console.log('     BAD:  "(.*)\" — backtracks excessively');
  console.log('     GOOD: "([^"]*)" — no backtracking needed');
  console.log();

  console.log("  4. Use non-capturing groups (?:...) when you don't need captures");
  console.log("     Reduces memory allocation for each match.");
  console.log();

  console.log("  5. Prefer string methods for simple operations");
  console.log('     str.includes("text")    faster than /text/.test(str)');
  console.log('     str.startsWith("http")  faster than /^http/.test(str)');
  console.log('     str.endsWith(".js")     faster than /\\.js$/.test(str)');
  console.log();

  console.log("  6. Beware the 'g' flag statefulness with test() and exec()");
  console.log("     Reset lastIndex to 0 when reusing a regex with 'g' flag.");
  console.log();

  console.log("  7. Use matchAll() instead of exec() loops");
  console.log("     Cleaner, no statefulness bugs, returns an iterator.");
  console.log();

  console.log("  8. Avoid catastrophic backtracking");
  console.log("     BAD:  /(a+)+$/ or /(a|a)+$/  — exponential time");
  console.log("     GOOD: Use specific patterns, avoid nested quantifiers.");
  console.log();

  // ──────────────────────────────────────────────────────────────────
  // 6.8  PERFORMANCE BENCHMARK
  // ──────────────────────────────────────────────────────────────────
  section("6.8 Performance Comparison Demo");

  const iterations = 100_000;
  const testInput = "The quick brown fox jumps over the lazy dog 12345";

  // Method 1: Literal regex (created once)
  const literalRx = /\d+/g;
  const start1 = performance.now();
  for (let i = 0; i < iterations; i++) {
    literalRx.lastIndex = 0;
    literalRx.test(testInput);
  }
  const time1 = (performance.now() - start1).toFixed(1);

  // Method 2: new RegExp each time
  const start2 = performance.now();
  for (let i = 0; i < iterations; i++) {
    new RegExp("\\d+").test(testInput);
  }
  const time2 = (performance.now() - start2).toFixed(1);

  // Method 3: String includes (for comparison)
  const start3 = performance.now();
  for (let i = 0; i < iterations; i++) {
    testInput.includes("12345");
  }
  const time3 = (performance.now() - start3).toFixed(1);

  console.log(`  ${iterations.toLocaleString()} iterations:`);
  console.log(`    Cached literal /\\d+/g : ${time1.padStart(8)}ms`);
  console.log(`    new RegExp() each time : ${time2.padStart(8)}ms`);
  console.log(`    str.includes()         : ${time3.padStart(8)}ms`);
  console.log();

  note("Caching regex and using string methods when possible saves significant time.");

  // ──────────────────────────────────────────────────────────────────
  // 6.9  COMMON PITFALLS
  // ──────────────────────────────────────────────────────────────────
  section("6.9 Common Pitfalls to Avoid");

  console.log("  PITFALL 1: Forgetting the 'g' flag with replace()");
  console.log('    "aaa".replace(/a/, "b")  = "' + "aaa".replace(/a/, "b") + '"  (only first!)');
  console.log('    "aaa".replace(/a/g, "b") = "' + "aaa".replace(/a/g, "b") + '" (all matches)');
  console.log();

  console.log("  PITFALL 2: Statefulness of /g flag with test() and exec()");
  const buggyRegex = /\d+/g;
  console.log(`    const rx = /\\d+/g;`);
  console.log(`    rx.test("abc123") = ${buggyRegex.test("abc123")}  (lastIndex is now ${buggyRegex.lastIndex})`);
  console.log(`    rx.test("abc123") = ${buggyRegex.test("abc123")}  (starts at ${buggyRegex.lastIndex - 3}! finds nothing after)`);
  buggyRegex.lastIndex = 0;
  console.log(`    rx.lastIndex = 0; // reset`);
  console.log(`    rx.test("abc123") = ${buggyRegex.test("abc123")}  (works again)`);
  console.log();

  console.log("  PITFALL 3: Greedy matching capturing too much");
  showExample(
    "Greedy .* captures too much",
    /<.*>/g,
    "<a>text</a>"
  );
  showExample(
    "Fix: use lazy .*? or negated class [^>]*",
    /<[^>]*>/g,
    "<a>text</a>"
  );

  console.log("  PITFALL 4: Not escaping user input in dynamic regex");
  console.log("    If user input contains regex metacharacters, escape them:");

  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const userInput = "price is $9.99 (sale)";
  console.log(`    Original: "${userInput}"`);
  console.log(`    Escaped:  "${escapeRegex(userInput)}"`);
  console.log();

  note("JavaScript has no built-in regex escape function — you must write your own (shown above).");

  console.log("  PITFALL 5: Catastrophic backtracking");
  console.log("    Pattern /(a+)+$/ against 'aaaaaaaaaaab' takes exponential time.");
  console.log("    JS has no built-in regex timeout — the engine will hang.");
  console.log("    Prevention:");
  console.log("      - Avoid nested quantifiers: (a+)+, (a*)*");
  console.log("      - Be specific: use [^x]* instead of .*");
  console.log("      - Test patterns with long inputs before deploying");
  console.log();

  console.log("  PITFALL 6: Verbose/commented patterns");
  console.log("    JS has NO IgnorePatternWhitespace flag like .NET's (?x).");
  console.log("    Workaround: build patterns from parts:");
  console.log();

  const yearPart = String.raw`(?<year>\d{4})`;
  const monthPart = String.raw`(?<month>0[1-9]|1[0-2])`;
  const dayPart = String.raw`(?<day>0[1-9]|[12]\d|3[01])`;
  const datePattern = new RegExp(`^${yearPart}-${monthPart}-${dayPart}$`);

  console.log(`    const yearPart  = String.raw\`(?<year>\\d{4})\`;`);
  console.log(`    const monthPart = String.raw\`(?<month>0[1-9]|1[0-2])\`;`);
  console.log(`    const dayPart   = String.raw\`(?<day>0[1-9]|[12]\\d|3[01])\`;`);
  console.log(`    const pattern   = new RegExp(\`^\${yearPart}-\${monthPart}-\${dayPart}$\`);`);
  console.log();

  const dateTest = datePattern.exec("2024-12-25");
  if (dateTest?.groups) {
    console.log(`    Matched: Year=${dateTest.groups.year}, Month=${dateTest.groups.month}, Day=${dateTest.groups.day}`);
  }
  console.log();

  note("Breaking complex patterns into named parts is the JS equivalent of verbose regex.");
}
