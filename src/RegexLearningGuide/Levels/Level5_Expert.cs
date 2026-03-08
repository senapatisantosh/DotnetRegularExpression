using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 5: EXPERT - Named Groups, Balancing Groups, and Compilation
///
/// What you'll learn:
///   - Named capturing groups: (?&lt;name&gt;pattern)
///   - Balancing groups (unique to .NET): (?&lt;name&gt;-&lt;other&gt;)
///   - Compiled regex: RegexOptions.Compiled
///   - Source-generated regex: [GeneratedRegex] (.NET 7+)
///   - MatchEvaluator delegates for advanced replacements
///   - Regex timeout for safety
/// </summary>
public static class Level5_Expert
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 5.1  NAMED CAPTURING GROUPS
        // ────────────────────────────────────────────────────────────────

        Section("5.1 Named Capturing Groups — (?<name>pattern)");

        Note("Named groups make patterns more readable and maintainable.");
        Note("Access by name: match.Groups[\"name\"].Value");

        ShowExample(
            "Parse a date with named groups",
            pattern: @"(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})",
            input: "Today is 2024-12-25");

        // Demonstrate accessing named groups programmatically
        Console.WriteLine("  ▸ Accessing named groups in code:");
        var dateMatch = Regex.Match("2024-12-25", @"(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})");
        if (dateMatch.Success)
        {
            Console.WriteLine($"    Year  = {dateMatch.Groups["year"].Value}");
            Console.WriteLine($"    Month = {dateMatch.Groups["month"].Value}");
            Console.WriteLine($"    Day   = {dateMatch.Groups["day"].Value}");
        }
        Console.WriteLine();

        // Named backreference
        ShowExample(
            @"Named backreference \k<word> — Find duplicate words",
            pattern: @"\b(?<word>\w+)\s+\k<word>\b",
            input: "This is is a repeated repeated test");

        // Named groups in replacements
        ShowReplace(
            "Use ${name} in replacement strings",
            pattern: @"(?<first>\w+)\s+(?<last>\w+)",
            input: "John Smith",
            replacement: "${last}, ${first}");

        // ────────────────────────────────────────────────────────────────
        // 5.2  BALANCING GROUPS — UNIQUE TO .NET
        // ────────────────────────────────────────────────────────────────

        Section("5.2 Balancing Groups — Match nested structures (unique to .NET!)");

        Note("Balancing groups can match properly nested structures like parentheses.");
        Note("Syntax: (?<open>\\() pushes, (?<-open>\\)) pops from the stack.");
        Note("(?(open)(?!)) at the end asserts the stack is empty (balanced).");

        // Pattern explanation:
        // ^                  — start of string
        // (                  — outer group for the whole expression
        //   [^()]*           — match non-paren characters
        //   (                — start group for nested structure
        //     (              — alternation group
        //       (?<open>\()  — on '(', push to 'open' stack
        //       |
        //       (?<-open>\)) — on ')', pop from 'open' stack (fails if empty)
        //     )
        //     [^()]*         — match non-paren characters
        //   )+               — repeat for nested parens
        // )
        // (?(open)(?!))      — assert 'open' stack is empty
        // $                  — end of string

        string balancingPattern = @"^[^()]*(((?<open>\()|(?<-open>\)))[^()]*)+$";

        Console.WriteLine("  ▸ Matching balanced parentheses:");
        Console.WriteLine($"    Pattern: {balancingPattern}");
        Console.WriteLine();

        string[] testStrings = [
            "(a + b)",
            "((a + b) * (c + d))",
            "(a + (b * c)",      // unbalanced
            "a + b) * c(",       // unbalanced
            "((()))",
        ];

        foreach (var test in testStrings)
        {
            // Use a simpler but effective balancing group pattern
            string pattern = @"^\((?:[^()]|(?<open>\()|(?<-open>\)))*(?(open)(?!))\)$";
            bool isBalanced = Regex.IsMatch(test, pattern);
            Console.WriteLine($"    \"{test}\" => {(isBalanced ? "BALANCED" : "UNBALANCED")}");
        }
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 5.3  MATCHEVALUATOR — DYNAMIC REPLACEMENTS
        // ────────────────────────────────────────────────────────────────

        Section("5.3 MatchEvaluator — Use delegates for dynamic replacements");

        // Replace with a delegate that transforms each match
        Console.WriteLine("  ▸ Double every number in a string:");
        string input1 = "I have 3 cats and 5 dogs and 12 fish";
        string result1 = Regex.Replace(input1, @"\d+", match =>
        {
            int number = int.Parse(match.Value);
            return (number * 2).ToString();
        });
        Console.WriteLine($"    Input  : \"{input1}\"");
        Console.WriteLine($"    Result : \"{result1}\"");
        Console.WriteLine();

        // Title case conversion
        Console.WriteLine("  ▸ Convert to Title Case:");
        string input2 = "the quick brown fox jumps over the lazy dog";
        string result2 = Regex.Replace(input2, @"\b\w", match =>
            match.Value.ToUpper());
        Console.WriteLine($"    Input  : \"{input2}\"");
        Console.WriteLine($"    Result : \"{result2}\"");
        Console.WriteLine();

        // Mask sensitive data
        Console.WriteLine("  ▸ Mask credit card numbers:");
        string input3 = "Card: 4111-1111-1111-1111, Alt: 5500-0000-0000-0004";
        string result3 = Regex.Replace(input3, @"\d{4}-\d{4}-\d{4}-(\d{4})", match =>
            $"****-****-****-{match.Groups[1].Value}");
        Console.WriteLine($"    Input  : \"{input3}\"");
        Console.WriteLine($"    Result : \"{result3}\"");
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 5.4  COMPILED REGEX & SOURCE GENERATORS
        // ────────────────────────────────────────────────────────────────

        Section("5.4 Compiled Regex & Source Generators");

        Note("RegexOptions.Compiled — Compiles pattern to IL for faster execution.");
        Note("Best for patterns used many times. Slower startup, faster matching.");

        Console.WriteLine("  ▸ Creating a compiled regex:");
        Console.WriteLine("    var regex = new Regex(@\"\\d+\", RegexOptions.Compiled);");
        Console.WriteLine();

        // Demonstrate compiled regex
        var compiledRegex = new Regex(@"\d+", RegexOptions.Compiled);
        var match2 = compiledRegex.Match("Order #12345");
        Console.WriteLine($"    Match: \"{match2.Value}\" at index {match2.Index}");
        Console.WriteLine();

        Note(".NET 7+ introduced [GeneratedRegex] for compile-time source generation:");
        Console.WriteLine("    [GeneratedRegex(@\"\\d+\")]");
        Console.WriteLine("    private static partial Regex NumberPattern();");
        Console.WriteLine();
        Note("Source generators produce C# code at compile time — zero runtime cost!");

        // Show the source-generated regex
        var genMatch = NumberPattern().Match("Order #12345");
        Console.WriteLine($"  ▸ Source-generated regex match: \"{genMatch.Value}\"");
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 5.5  REGEX TIMEOUT — PREVENT CATASTROPHIC BACKTRACKING
        // ────────────────────────────────────────────────────────────────

        Section("5.5 Regex Timeout — Safety against catastrophic backtracking");

        Note("Some patterns can take exponential time on certain inputs.");
        Note("Always set a timeout when processing untrusted input!");

        Console.WriteLine("  ▸ Creating a regex with a 2-second timeout:");
        Console.WriteLine("    var regex = new Regex(pattern, RegexOptions.None,");
        Console.WriteLine("                         TimeSpan.FromSeconds(2));");
        Console.WriteLine();

        // Demonstrate timeout
        try
        {
            // This pattern is intentionally crafted to demonstrate timeout.
            // (a+)+ is a classic catastrophic backtracking pattern.
            var riskyRegex = new Regex(@"^(a+)+$", RegexOptions.None,
                TimeSpan.FromMilliseconds(500));
            // Short input works fine
            Console.WriteLine($"    Short input 'aaaaab': IsMatch = {riskyRegex.IsMatch("aaaaab")}");

            // Long input might timeout
            string longInput = new string('a', 25) + "b";
            Console.WriteLine($"    Long input (25 a's + b): trying with 500ms timeout...");
            bool result = riskyRegex.IsMatch(longInput);
            Console.WriteLine($"    Result: {result}");
        }
        catch (RegexMatchTimeoutException ex)
        {
            Console.WriteLine($"    TIMEOUT! Regex exceeded {ex.MatchTimeout.TotalMilliseconds}ms");
            Console.WriteLine("    This is why timeouts are important for untrusted input!");
        }
        Console.WriteLine();
    }

    // Source-generated regex (compile-time optimization, .NET 7+)
    [GeneratedRegex(@"\d+")]
    private static partial Regex NumberPattern();
}
