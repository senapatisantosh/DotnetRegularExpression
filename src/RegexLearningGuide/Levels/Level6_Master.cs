using System.Diagnostics;
using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 6: MASTER - Real-World Patterns and Performance
///
/// What you'll learn:
///   - Email validation
///   - URL parsing
///   - IP address matching
///   - Log file parsing
///   - HTML/XML tag matching
///   - CSV parsing with quoted fields
///   - Performance best practices
///   - Common pitfalls and how to avoid them
/// </summary>
public static class Level6_Master
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 6.1  EMAIL VALIDATION
        // ────────────────────────────────────────────────────────────────

        Section("6.1 Real-World: Email Validation");

        // Practical email pattern (not RFC 5322 complete, but good for most cases)
        string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

        Console.WriteLine($"  Pattern: {emailPattern}");
        Console.WriteLine();

        string[] emails = [
            "user@example.com",
            "first.last@company.co.uk",
            "user+tag@gmail.com",
            "invalid@",
            "@nouser.com",
            "spaces not@allowed.com",
            "user@123.123.123.123",
        ];

        foreach (var email in emails)
        {
            bool valid = Regex.IsMatch(email, emailPattern);
            Console.WriteLine($"    {email,-35} => {(valid ? "VALID" : "INVALID")}");
        }
        Console.WriteLine();

        Note("For production email validation, consider using System.Net.Mail.MailAddress.");

        // ────────────────────────────────────────────────────────────────
        // 6.2  URL PARSING
        // ────────────────────────────────────────────────────────────────

        Section("6.2 Real-World: URL Parsing");

        string urlPattern = @"^(?<scheme>https?):\/\/(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>\/[^\s?#]*)?(?:\?(?<query>[^\s#]*))?(?:#(?<fragment>\S*))?$";

        string[] urls = [
            "https://www.example.com/path/to/page?name=value&foo=bar#section",
            "http://localhost:8080/api/users",
            "https://example.com",
        ];

        foreach (var url in urls)
        {
            var match = Regex.Match(url, urlPattern);
            if (match.Success)
            {
                Console.WriteLine($"  ▸ URL: {url}");
                Console.WriteLine($"    Scheme   : {match.Groups["scheme"].Value}");
                Console.WriteLine($"    Host     : {match.Groups["host"].Value}");
                if (match.Groups["port"].Success)
                    Console.WriteLine($"    Port     : {match.Groups["port"].Value}");
                if (match.Groups["path"].Success)
                    Console.WriteLine($"    Path     : {match.Groups["path"].Value}");
                if (match.Groups["query"].Success)
                    Console.WriteLine($"    Query    : {match.Groups["query"].Value}");
                if (match.Groups["fragment"].Success)
                    Console.WriteLine($"    Fragment : {match.Groups["fragment"].Value}");
                Console.WriteLine();
            }
        }

        Note("For production URL parsing, use the Uri class instead of regex.");

        // ────────────────────────────────────────────────────────────────
        // 6.3  IP ADDRESS MATCHING
        // ────────────────────────────────────────────────────────────────

        Section("6.3 Real-World: IP Address Validation");

        // IPv4 with proper octet range validation (0-255)
        string ipPattern = @"^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$";

        string[] ips = ["192.168.1.1", "10.0.0.1", "255.255.255.255", "256.1.1.1", "1.2.3", "1.2.3.4.5"];

        foreach (var ip in ips)
        {
            bool valid = Regex.IsMatch(ip, ipPattern);
            Console.WriteLine($"    {ip,-20} => {(valid ? "VALID" : "INVALID")}");
        }
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 6.4  LOG FILE PARSING
        // ────────────────────────────────────────────────────────────────

        Section("6.4 Real-World: Log File Parsing");

        string logPattern = @"^\[(?<timestamp>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\]\s+\[(?<level>\w+)\]\s+(?<message>.+)$";

        string[] logLines = [
            "[2024-12-25 10:30:00] [INFO] Application started successfully",
            "[2024-12-25 10:30:05] [WARN] Configuration file not found, using defaults",
            "[2024-12-25 10:30:10] [ERROR] Failed to connect to database: timeout after 30s",
        ];

        foreach (var line in logLines)
        {
            var match = Regex.Match(line, logPattern);
            if (match.Success)
            {
                Console.WriteLine($"  ▸ Timestamp : {match.Groups["timestamp"].Value}");
                Console.WriteLine($"    Level     : {match.Groups["level"].Value}");
                Console.WriteLine($"    Message   : {match.Groups["message"].Value}");
                Console.WriteLine();
            }
        }

        // ────────────────────────────────────────────────────────────────
        // 6.5  CSV PARSING WITH QUOTED FIELDS
        // ────────────────────────────────────────────────────────────────

        Section("6.5 Real-World: CSV Field Parsing");

        // Handle both quoted and unquoted fields, including escaped quotes
        string csvPattern = @"(?:^|,)(?:""(?<quoted>(?:[^""]|"""")*)""|(?<unquoted>[^,""]*))";

        string csvLine = @"John,""Smith, Jr."",30,""He said """"hello"""""",NYC";
        Console.WriteLine($"  ▸ CSV Line: {csvLine}");
        Console.WriteLine("    Fields:");

        var csvMatches = Regex.Matches(csvLine, csvPattern);
        int fieldNum = 1;
        foreach (Match m in csvMatches)
        {
            string value = m.Groups["quoted"].Success
                ? m.Groups["quoted"].Value.Replace("\"\"", "\"")
                : m.Groups["unquoted"].Value;
            Console.WriteLine($"      Field {fieldNum++}: \"{value}\"");
        }
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 6.6  EXTRACTING DATA FROM STRUCTURED TEXT
        // ────────────────────────────────────────────────────────────────

        Section("6.6 Real-World: Extract data from structured text");

        // Parse a connection string
        string connString = "Server=myserver;Database=mydb;User Id=admin;Password=secret123;Timeout=30;";
        string connPattern = @"(?<key>\w+)=(?<value>[^;]+)";

        Console.WriteLine($"  ▸ Connection string: {connString}");
        Console.WriteLine("    Parsed key-value pairs:");
        foreach (Match m in Regex.Matches(connString, connPattern))
        {
            Console.WriteLine($"      {m.Groups["key"].Value,-12} = {m.Groups["value"].Value}");
        }
        Console.WriteLine();

        // Parse semantic version
        string semverPattern = @"^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<prerelease>[a-zA-Z0-9.]+))?(?:\+(?<build>[a-zA-Z0-9.]+))?$";

        string[] versions = ["1.0.0", "2.3.1-beta.1", "3.0.0-rc.1+build.123"];

        Console.WriteLine("  ▸ Semantic version parsing:");
        foreach (var ver in versions)
        {
            var match = Regex.Match(ver, semverPattern);
            if (match.Success)
            {
                Console.Write($"    {ver,-30} => ");
                Console.Write($"Major={match.Groups["major"].Value}");
                Console.Write($", Minor={match.Groups["minor"].Value}");
                Console.Write($", Patch={match.Groups["patch"].Value}");
                if (match.Groups["prerelease"].Success)
                    Console.Write($", Pre={match.Groups["prerelease"].Value}");
                if (match.Groups["build"].Success)
                    Console.Write($", Build={match.Groups["build"].Value}");
                Console.WriteLine();
            }
        }
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 6.7  PERFORMANCE BEST PRACTICES
        // ────────────────────────────────────────────────────────────────

        Section("6.7 Performance Best Practices");

        Console.WriteLine("  1. REUSE Regex instances — don't create new ones in loops");
        Console.WriteLine("     BAD:  for(...) { Regex.IsMatch(s, pattern); }  // recompiles each time");
        Console.WriteLine("     GOOD: var rx = new Regex(pattern);");
        Console.WriteLine("           for(...) { rx.IsMatch(s); }");
        Console.WriteLine();

        Console.WriteLine("  2. Use RegexOptions.Compiled for hot paths");
        Console.WriteLine("     var rx = new Regex(pattern, RegexOptions.Compiled);");
        Console.WriteLine("     ~10x faster matching, but slower construction.");
        Console.WriteLine();

        Console.WriteLine("  3. Use [GeneratedRegex] (.NET 7+) for best performance");
        Console.WriteLine("     Generates IL at compile time — zero runtime compilation cost.");
        Console.WriteLine();

        Console.WriteLine("  4. Avoid catastrophic backtracking");
        Console.WriteLine("     BAD:  (a+)+ or (a|a)+  — exponential backtracking");
        Console.WriteLine("     GOOD: Use atomic groups (?>...) or possessive quantifiers.");
        Console.WriteLine();

        Console.WriteLine("  5. Always set a timeout for untrusted input");
        Console.WriteLine("     new Regex(pattern, opts, TimeSpan.FromSeconds(2));");
        Console.WriteLine();

        Console.WriteLine("  6. Be specific — avoid .* when you can use [^x]*");
        Console.WriteLine("     BAD:  \"(.*)\" — backtracks excessively");
        Console.WriteLine("     GOOD: \"([^\"]*)\" — no backtracking needed");
        Console.WriteLine();

        Console.WriteLine("  7. Use non-capturing groups (?:...) when you don't need captures");
        Console.WriteLine("     Reduces memory allocation.");
        Console.WriteLine();

        Console.WriteLine("  8. Prefer string methods for simple operations");
        Console.WriteLine("     Use str.Contains(), StartsWith(), EndsWith() when regex isn't needed.");
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 6.8  PERFORMANCE BENCHMARK DEMO
        // ────────────────────────────────────────────────────────────────

        Section("6.8 Performance Comparison Demo");

        const int iterations = 100_000;
        string testInput = "The quick brown fox jumps over the lazy dog 12345";

        // Method 1: Static Regex (cached internally after first call)
        var sw1 = Stopwatch.StartNew();
        for (int i = 0; i < iterations; i++)
            Regex.IsMatch(testInput, @"\d+");
        sw1.Stop();

        // Method 2: Pre-compiled instance
        var compiledRx = new Regex(@"\d+", RegexOptions.Compiled);
        var sw2 = Stopwatch.StartNew();
        for (int i = 0; i < iterations; i++)
            compiledRx.IsMatch(testInput);
        sw2.Stop();

        // Method 3: Non-compiled instance
        var instanceRx = new Regex(@"\d+");
        var sw3 = Stopwatch.StartNew();
        for (int i = 0; i < iterations; i++)
            instanceRx.IsMatch(testInput);
        sw3.Stop();

        Console.WriteLine($"  {iterations:N0} iterations of matching @\"\\d+\":");
        Console.WriteLine($"    Static  Regex.IsMatch()  : {sw1.ElapsedMilliseconds,6}ms");
        Console.WriteLine($"    Compiled instance        : {sw2.ElapsedMilliseconds,6}ms");
        Console.WriteLine($"    Non-compiled instance    : {sw3.ElapsedMilliseconds,6}ms");
        Console.WriteLine();

        Note("Results vary by machine. Compiled regex is fastest for repeated use.");

        // ────────────────────────────────────────────────────────────────
        // 6.9  COMMON PITFALLS
        // ────────────────────────────────────────────────────────────────

        Section("6.9 Common Pitfalls to Avoid");

        Console.WriteLine("  PITFALL 1: Forgetting that regex is greedy by default");
        ShowExample(
            "Greedy .* captures too much",
            pattern: "<.*>",
            input: "<a>text</a>");
        ShowExample(
            "Fix: use lazy .*? or negated class [^>]*",
            pattern: "<[^>]*>",
            input: "<a>text</a>");

        Console.WriteLine("  PITFALL 2: Not escaping user input");
        Console.WriteLine("    If user input contains regex metacharacters, use Regex.Escape():");
        string userInput = "price is $9.99 (sale)";
        string escaped = Regex.Escape(userInput);
        Console.WriteLine($"    Original: \"{userInput}\"");
        Console.WriteLine($"    Escaped:  \"{escaped}\"");
        Console.WriteLine();

        Console.WriteLine("  PITFALL 3: Using regex when string methods suffice");
        Console.WriteLine("    input.Contains(\"hello\")      is faster than Regex.IsMatch(input, \"hello\")");
        Console.WriteLine("    input.StartsWith(\"http\")     is faster than Regex.IsMatch(input, \"^http\")");
        Console.WriteLine("    input.Replace(\"old\", \"new\")  is faster than Regex.Replace(input, \"old\", \"new\")");
        Console.WriteLine();

        Console.WriteLine("  PITFALL 4: Over-complex patterns");
        Console.WriteLine("    Break complex patterns into multiple simpler operations.");
        Console.WriteLine("    Use Regex comments with (?x) / RegexOptions.IgnorePatternWhitespace:");
        Console.WriteLine();

        // Demonstrate verbose/commented regex
        var verbosePattern = new Regex(@"
            ^                       # Start of string
            (?<year>\d{4})          # Year: 4 digits
            -                       # Literal dash
            (?<month>0[1-9]|1[0-2]) # Month: 01-12
            -                       # Literal dash
            (?<day>0[1-9]|[12]\d|3[01]) # Day: 01-31
            $                       # End of string
        ", RegexOptions.IgnorePatternWhitespace);

        var dateTest = verbosePattern.Match("2024-12-25");
        Console.WriteLine($"    Verbose date pattern matched: {dateTest.Success}");
        Console.WriteLine($"    Year={dateTest.Groups["year"]}, Month={dateTest.Groups["month"]}, Day={dateTest.Groups["day"]}");
        Console.WriteLine();

        Note("IgnorePatternWhitespace lets you add comments and whitespace for readability.");
    }
}
