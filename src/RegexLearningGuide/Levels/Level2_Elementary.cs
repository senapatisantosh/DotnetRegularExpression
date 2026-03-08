using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 2: ELEMENTARY - Character Classes and Quantifiers
///
/// What you'll learn:
///   - Character classes [abc], [a-z], [^abc]
///   - Quantifiers: * + ? {n} {n,} {n,m}
///   - Greedy vs Lazy matching
///   - Regex.Replace() basics
///   - Regex.Split() basics
/// </summary>
public static class Level2_Elementary
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 2.1  CHARACTER CLASSES — [...]
        // ────────────────────────────────────────────────────────────────
        Section("2.1 Character Classes — Match one character from a set");

        // Match specific characters
        ShowExample(
            "[aeiou] — Match any single vowel",
            pattern: "[aeiou]",
            input: "Hello World");

        // Character range
        ShowExample(
            "[a-z] — Match any lowercase letter",
            pattern: "[a-z]+",
            input: "Hello World 123");

        ShowExample(
            "[A-Za-z] — Match any letter (upper or lower)",
            pattern: "[A-Za-z]+",
            input: "Hello World 123");

        ShowExample(
            "[0-9] — Match any digit (same as \\d)",
            pattern: "[0-9]+",
            input: "Invoice #12345");

        // Negated character class
        ShowExample(
            "[^0-9] — Match any character that is NOT a digit",
            pattern: "[^0-9]+",
            input: "abc123def456");

        ShowExample(
            "[^aeiou] — Match any character that is NOT a vowel",
            pattern: "[^aeiou]+",
            input: "hello world",
            options: RegexOptions.IgnoreCase);

        // Combining ranges
        ShowExample(
            "[a-zA-Z0-9_] — Same as \\w (word characters)",
            pattern: "[a-zA-Z0-9_]+",
            input: "user_name = value123");

        Note("Inside [...], most metacharacters lose their special meaning. " +
             "Only ] \\ ^ - need escaping.");

        // ────────────────────────────────────────────────────────────────
        // 2.2  QUANTIFIERS
        // ────────────────────────────────────────────────────────────────
        Section("2.2 Quantifiers — How many times to match");

        // * = zero or more
        ShowExample(
            "a* — Zero or more 'a' characters",
            pattern: "ca*t",
            input: "ct cat caat caaat cbt");

        // + = one or more
        ShowExample(
            "a+ — One or more 'a' characters",
            pattern: "ca+t",
            input: "ct cat caat caaat");

        // ? = zero or one (optional)
        ShowExample(
            "colou?r — The 'u' is optional",
            pattern: "colou?r",
            input: "color and colour are both valid");

        // {n} = exactly n
        ShowExample(
            @"\d{3} — Exactly 3 digits",
            pattern: @"\d{3}",
            input: "1 12 123 1234 12345");

        // {n,} = n or more
        ShowExample(
            @"\d{2,} — 2 or more digits",
            pattern: @"\d{2,}",
            input: "1 12 123 1234");

        // {n,m} = between n and m
        ShowExample(
            @"\d{2,4} — Between 2 and 4 digits",
            pattern: @"\d{2,4}",
            input: "1 12 123 1234 12345");

        // ────────────────────────────────────────────────────────────────
        // 2.3  GREEDY vs LAZY MATCHING
        // ────────────────────────────────────────────────────────────────
        Section("2.3 Greedy vs Lazy — How much to consume");

        Note("By default, quantifiers are GREEDY — they match as much as possible.");
        Note("Add '?' after a quantifier to make it LAZY — match as little as possible.");

        // Greedy: matches the longest possible string
        ShowExample(
            "Greedy: \".*\" grabs everything between first and LAST quote",
            pattern: "\".*\"",
            input: "He said \"hello\" and \"goodbye\"");

        // Lazy: matches the shortest possible string
        ShowExample(
            "Lazy: \".*?\" grabs between first and NEAREST quote",
            pattern: "\".*?\"",
            input: "He said \"hello\" and \"goodbye\"");

        // More examples of greedy vs lazy
        ShowExample(
            "Greedy: <.+> matches the entire tag content",
            pattern: "<.+>",
            input: "<b>bold</b>");

        ShowExample(
            "Lazy: <.+?> matches individual tags",
            pattern: "<.+?>",
            input: "<b>bold</b>");

        // ────────────────────────────────────────────────────────────────
        // 2.4  Regex.Replace() — SEARCH AND REPLACE
        // ────────────────────────────────────────────────────────────────
        Section("2.4 Regex.Replace() — Search and replace with patterns");

        ShowReplace(
            "Replace all digits with '#'",
            pattern: @"\d",
            input: "Phone: 555-1234",
            replacement: "#");

        ShowReplace(
            "Remove extra whitespace (replace 2+ spaces with one)",
            pattern: @"\s{2,}",
            input: "Too   many     spaces    here",
            replacement: " ");

        ShowReplace(
            "Censor bad words (case-insensitive)",
            pattern: @"darn|heck",
            input: "Oh darn, what the heck!",
            replacement: "****",
            options: RegexOptions.IgnoreCase);

        // ────────────────────────────────────────────────────────────────
        // 2.5  Regex.Split() — SPLIT BY PATTERN
        // ────────────────────────────────────────────────────────────────
        Section("2.5 Regex.Split() — Split strings using patterns");

        ShowSplit(
            "Split on any whitespace",
            pattern: @"\s+",
            input: "Split   these   words   apart");

        ShowSplit(
            "Split on punctuation",
            pattern: @"[,;:]+\s*",
            input: "one,two;three: four, five");

        ShowSplit(
            "Split a CSV line (handling optional spaces after comma)",
            pattern: @",\s*",
            input: "apple, banana, cherry, date");

        ShowSplit(
            "Split on camelCase boundaries",
            pattern: @"(?=[A-Z])",
            input: "thisIsCamelCaseText");
    }
}
