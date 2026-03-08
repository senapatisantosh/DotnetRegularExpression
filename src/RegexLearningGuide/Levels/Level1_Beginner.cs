using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 1: BEGINNER - First Steps with Regular Expressions
///
/// What you'll learn:
///   - What a regular expression is
///   - Regex.IsMatch() — checking if a pattern exists
///   - Regex.Match()   — finding the first match
///   - Regex.Matches() — finding all matches
///   - Literal character matching
///   - The dot (.) metacharacter — match any character
///   - Basic escape sequences (\d, \w, \s)
/// </summary>
public static class Level1_Beginner
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 1.1  WHAT IS A REGULAR EXPRESSION?
        // ────────────────────────────────────────────────────────────────
        // A regular expression (regex) is a sequence of characters that
        // defines a search pattern. In .NET, regex lives in the
        // System.Text.RegularExpressions namespace.
        //
        // Key classes:
        //   Regex       — the compiled pattern
        //   Match       — a single match result
        //   MatchCollection — all matches
        //   Group       — a captured group within a match

        Section("1.1 Literal Matching — Searching for exact text");

        // The simplest regex: match an exact string
        ShowIsMatch(
            "Does the string contain 'cat'?",
            pattern: "cat",
            input: "The cat sat on the mat");

        ShowIsMatch(
            "Does the string contain 'dog'?",
            pattern: "dog",
            input: "The cat sat on the mat");

        Note("Regex is case-sensitive by default. 'Cat' != 'cat'.");

        ShowIsMatch(
            "Case-sensitive: searching for 'Cat'",
            pattern: "Cat",
            input: "The cat sat on the mat");

        ShowIsMatch(
            "Case-insensitive: searching for 'Cat' with IgnoreCase",
            pattern: "Cat",
            input: "The cat sat on the mat",
            options: RegexOptions.IgnoreCase);

        // ────────────────────────────────────────────────────────────────
        // 1.2  THREE ESSENTIAL METHODS
        // ────────────────────────────────────────────────────────────────
        Section("1.2 Three Essential Regex Methods");

        string text = "Order 100 and Order 200 were shipped.";

        // IsMatch — returns true/false
        Console.WriteLine("  ▸ Regex.IsMatch() — Does it contain a number?");
        Console.WriteLine($"    {Regex.IsMatch(text, @"\d+")}");
        Console.WriteLine();

        // Match — returns the FIRST match
        Console.WriteLine("  ▸ Regex.Match() — Find the first number");
        var firstMatch = Regex.Match(text, @"\d+");
        Console.WriteLine($"    Found: \"{firstMatch.Value}\" at index {firstMatch.Index}");
        Console.WriteLine();

        // Matches — returns ALL matches
        Console.WriteLine("  ▸ Regex.Matches() — Find all numbers");
        var allMatches = Regex.Matches(text, @"\d+");
        foreach (Match m in allMatches)
        {
            Console.WriteLine($"    Found: \"{m.Value}\" at index {m.Index}");
        }
        Console.WriteLine();

        // ────────────────────────────────────────────────────────────────
        // 1.3  THE DOT (.) METACHARACTER
        // ────────────────────────────────────────────────────────────────
        Section("1.3 The Dot (.) — Matches any single character (except newline)");

        ShowExample(
            "Pattern 'c.t' matches any character between c and t",
            pattern: "c.t",
            input: "cat cot cut c t c9t");

        Note("The dot does NOT match newline (\\n) by default. Use RegexOptions.Singleline to change this.");

        // ────────────────────────────────────────────────────────────────
        // 1.4  BASIC ESCAPE SEQUENCES (SHORTHAND CHARACTER CLASSES)
        // ────────────────────────────────────────────────────────────────
        Section("1.4 Shorthand Character Classes");

        // \d = any digit [0-9]
        ShowExample(
            @"\d — Matches any digit (0-9)",
            pattern: @"\d",
            input: "Room 42 on Floor 3");

        // \D = any NON-digit
        ShowExample(
            @"\D — Matches any non-digit",
            pattern: @"\D+",
            input: "abc123def456");

        // \w = any word character [a-zA-Z0-9_]
        ShowExample(
            @"\w+ — Matches word characters (letters, digits, underscore)",
            pattern: @"\w+",
            input: "hello_world 123 foo-bar");

        // \W = any NON-word character
        ShowExample(
            @"\W+ — Matches non-word characters",
            pattern: @"\W+",
            input: "hello world! how are you?");

        // \s = any whitespace (space, tab, newline)
        ShowExample(
            @"\s — Matches whitespace characters",
            pattern: @"\s",
            input: "a b\tc");

        // \S = any NON-whitespace
        ShowExample(
            @"\S+ — Matches non-whitespace characters",
            pattern: @"\S+",
            input: "Split these words");

        // ────────────────────────────────────────────────────────────────
        // 1.5  ESCAPING SPECIAL CHARACTERS
        // ────────────────────────────────────────────────────────────────
        Section("1.5 Escaping Special Characters with backslash (\\)");

        Note(@"These characters have special meaning in regex: . * + ? | \ ^ $ ( ) [ ] { }");
        Note(@"To match them literally, prefix with backslash: \. \* \+ etc.");

        ShowExample(
            "Match a literal dot in a filename",
            pattern: @"\w+\.\w+",
            input: "file.txt and image.png are files");

        ShowExample(
            "Match a literal dollar amount",
            pattern: @"\$\d+\.\d{2}",
            input: "The price is $19.99 today");

        // ────────────────────────────────────────────────────────────────
        // 1.6  STATIC vs INSTANCE USAGE
        // ────────────────────────────────────────────────────────────────
        Section("1.6 Static vs Instance — Two ways to use Regex");

        // Static method — convenient for one-off usage
        Console.WriteLine("  ▸ Static method (convenient for one-off checks):");
        bool found = Regex.IsMatch("hello123", @"\d+");
        Console.WriteLine($"    Regex.IsMatch(\"hello123\", @\"\\d+\") = {found}");
        Console.WriteLine();

        // Instance method — better for repeated use (compiles once)
        Console.WriteLine("  ▸ Instance method (better for repeated use):");
        var regex = new Regex(@"\d+");
        Console.WriteLine($"    regex.IsMatch(\"hello123\") = {regex.IsMatch("hello123")}");
        Console.WriteLine($"    regex.IsMatch(\"no digits\") = {regex.IsMatch("no digits")}");
        Console.WriteLine();

        Note("Use instance Regex when you'll reuse the pattern multiple times — it avoids recompilation.");
    }
}
