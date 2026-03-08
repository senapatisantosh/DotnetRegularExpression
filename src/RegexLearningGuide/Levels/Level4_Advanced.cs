using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 4: ADVANCED - Lookahead, Lookbehind, and Backreferences
///
/// What you'll learn:
///   - Positive lookahead:  (?=pattern)
///   - Negative lookahead:  (?!pattern)
///   - Positive lookbehind: (?&lt;=pattern)
///   - Negative lookbehind: (?&lt;!pattern)
///   - Atomic groups and possessive behavior
///   - Conditional matching
///   - Inline options (?i) (?m) (?s)
/// </summary>
public static class Level4_Advanced
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 4.1  POSITIVE LOOKAHEAD — (?=pattern)
        // ────────────────────────────────────────────────────────────────
        // Asserts that what follows the current position matches the
        // pattern, but does NOT consume characters (zero-width assertion).

        Section("4.1 Positive Lookahead (?=...) — Assert what comes AFTER");

        ShowExample(
            @"\w+(?=\.) — Match a word only if followed by a dot",
            pattern: @"\w+(?=\.)",
            input: "end. start middle. done");

        ShowExample(
            @"\d+(?= dollars) — Match a number only if followed by ' dollars'",
            pattern: @"\d+(?= dollars)",
            input: "I have 100 dollars and 50 euros");

        Note("Lookaheads don't consume characters — the dot/text after is NOT part of the match.");

        // ────────────────────────────────────────────────────────────────
        // 4.2  NEGATIVE LOOKAHEAD — (?!pattern)
        // ────────────────────────────────────────────────────────────────

        Section("4.2 Negative Lookahead (?!...) — Assert what must NOT come after");

        ShowExample(
            @"\d+(?! dollars) — Match numbers NOT followed by ' dollars'",
            pattern: @"\b\d+\b(?! dollars)",
            input: "I have 100 dollars and 50 euros");

        ShowExample(
            @"\b\w+\b(?!\.) — Match words NOT followed by a dot",
            pattern: @"\b\w+\b(?!\.)",
            input: "end. start middle. done");

        // Password validation — a great use of multiple lookaheads
        Section("4.2b Password Validation with Multiple Lookaheads");

        string passwordPattern = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%]).{8,}$";
        Note("Pattern: ^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$");
        Note("Requires: 1 uppercase, 1 lowercase, 1 digit, 1 special char, min 8 chars");

        ShowIsMatch("Weak password", passwordPattern, "password");
        ShowIsMatch("No special char", passwordPattern, "Password1");
        ShowIsMatch("Strong password", passwordPattern, "P@ssw0rd!");

        // ────────────────────────────────────────────────────────────────
        // 4.3  POSITIVE LOOKBEHIND — (?<=pattern)
        // ────────────────────────────────────────────────────────────────

        Section("4.3 Positive Lookbehind (?<=...) — Assert what comes BEFORE");

        ShowExample(
            @"(?<=\$)\d+ — Match digits only if preceded by $",
            pattern: @"(?<=\$)\d+",
            input: "Price: $100, Quantity: 50");

        ShowExample(
            @"(?<=@)\w+ — Match domain name after @ in email",
            pattern: @"(?<=@)\w+",
            input: "user@example.com admin@test.org");

        // ────────────────────────────────────────────────────────────────
        // 4.4  NEGATIVE LOOKBEHIND — (?<!pattern)
        // ────────────────────────────────────────────────────────────────

        Section("4.4 Negative Lookbehind (?<!...) — Assert what must NOT come before");

        ShowExample(
            @"(?<!\$)\b\d+\b — Match numbers NOT preceded by $",
            pattern: @"(?<!\$)\b\d+\b",
            input: "Price: $100, Quantity: 50, Tax: $8");

        ShowExample(
            @"(?<!un)happy — Match 'happy' only when NOT preceded by 'un'",
            pattern: @"(?<!un)happy",
            input: "I am happy but he is unhappy");

        // ────────────────────────────────────────────────────────────────
        // 4.5  COMBINING LOOKAROUNDS
        // ────────────────────────────────────────────────────────────────

        Section("4.5 Combining Lookarounds");

        ShowExample(
            "Extract text between parentheses (without the parentheses)",
            pattern: @"(?<=\().*?(?=\))",
            input: "Call (555-1234) or (800-5678)");

        ShowExample(
            "Match comma position for number formatting (lookahead + lookbehind)",
            pattern: @"(?<=\d)(?=(\d{3})+\b)",
            input: "1234567890");

        // Use Replace to insert commas
        ShowReplace(
            "Format number with commas: 1234567890 -> 1,234,567,890",
            pattern: @"(?<=\d)(?=(\d{3})+\b)",
            input: "1234567890",
            replacement: ",");

        // ────────────────────────────────────────────────────────────────
        // 4.6  INLINE OPTIONS
        // ────────────────────────────────────────────────────────────────

        Section("4.6 Inline Options — Embed options inside the pattern");

        Note("(?i) = IgnoreCase, (?m) = Multiline, (?s) = Singleline, (?x) = IgnorePatternWhitespace");

        ShowExample(
            "(?i) — Make part of the pattern case-insensitive",
            pattern: @"(?i)hello\s+(?-i)World",
            input: "HELLO World");

        ShowIsMatch(
            "(?i) applies: HeLLo matches",
            pattern: @"(?i)hello\s+(?-i)World",
            input: "HeLLo World");

        ShowIsMatch(
            "(?-i) resets: WORLD doesn't match (case-sensitive again)",
            pattern: @"(?i)hello\s+(?-i)World",
            input: "HELLO WORLD");

        // ────────────────────────────────────────────────────────────────
        // 4.7  CONDITIONAL MATCHING
        // ────────────────────────────────────────────────────────────────

        Section("4.7 Conditional Matching — (?(condition)yes|no)");

        Note("Syntax: (?(group)yes-pattern|no-pattern)");
        Note("If the group was matched, use yes-pattern; otherwise use no-pattern.");

        // Match optional opening paren, digits, then closing paren only if opening existed
        ShowExample(
            "(?(1)\\)): If '(' was captured, require matching ')'",
            pattern: @"(\()?\d{3}(?(1)\)|-)\d{3}-\d{4}",
            input: "(555)123-4567 and 555-123-4567 but not (555-123-4567");

        // ────────────────────────────────────────────────────────────────
        // 4.8  ATOMIC GROUPS  (?>...)
        // ────────────────────────────────────────────────────────────────

        Section("4.8 Atomic Groups (?>...) — Prevent backtracking");

        Note("Atomic groups lock in what they've matched and never backtrack.");
        Note("This can prevent catastrophic backtracking and improve performance.");

        Console.WriteLine("  ▸ Comparison of regular vs atomic group:");
        Console.WriteLine("    Regular  (a+)b   against 'aaaaac': backtracks extensively");
        Console.WriteLine("    Atomic   (?>a+)b  against 'aaaaac': fails fast, no backtracking");
        Console.WriteLine();

        ShowIsMatch(
            "Regular group: (a+)b against 'aaaaac'",
            pattern: "(a+)b",
            input: "aaaaac");

        ShowIsMatch(
            "Atomic group: (?>a+)b against 'aaaaac' (fails faster)",
            pattern: "(?>a+)b",
            input: "aaaaac");
    }
}
