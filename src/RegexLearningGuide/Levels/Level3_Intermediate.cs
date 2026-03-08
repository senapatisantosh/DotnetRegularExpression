using System.Text.RegularExpressions;
using static RegexLearningGuide.Helpers.DemoHelper;

namespace RegexLearningGuide.Levels;

/// <summary>
/// LEVEL 3: INTERMEDIATE - Groups, Anchors, and Alternation
///
/// What you'll learn:
///   - Anchors: ^ $ \b \B
///   - Capturing groups: (pattern)
///   - Non-capturing groups: (?:pattern)
///   - Alternation: pattern1|pattern2
///   - Backreferences: \1, \2
///   - Replace with captured groups: $1, $2
/// </summary>
public static class Level3_Intermediate
{
    public static void Run()
    {
        // ────────────────────────────────────────────────────────────────
        // 3.1  ANCHORS
        // ────────────────────────────────────────────────────────────────
        Section("3.1 Anchors — Match positions, not characters");

        // ^ matches the start of the string (or line with Multiline option)
        ShowIsMatch(
            "^ — String starts with 'Hello'",
            pattern: "^Hello",
            input: "Hello World");

        ShowIsMatch(
            "^ — 'World' is NOT at the start",
            pattern: "^World",
            input: "Hello World");

        // $ matches the end of the string
        ShowIsMatch(
            "$ — String ends with 'World'",
            pattern: "World$",
            input: "Hello World");

        // \b matches a word boundary
        ShowExample(
            @"\bcat\b — Match 'cat' as a whole word only",
            pattern: @"\bcat\b",
            input: "The cat scattered the catalog");

        Note(@"\b matches the boundary between a \w and a \W character (or start/end of string).");

        // \B matches a NON-word-boundary
        ShowExample(
            @"\Bcat\B — Match 'cat' only when NOT a whole word",
            pattern: @"\Bcat\B",
            input: "The cat scattered the catalog education");

        // Multiline mode: ^ and $ match line starts/ends
        Section("3.1b Multiline Mode — ^ and $ match each line");

        string multiline = "First line\nSecond line\nThird line";
        ShowExample(
            "Without Multiline: ^ only matches start of entire string",
            pattern: @"^\w+",
            input: multiline);

        ShowExample(
            "With Multiline: ^ matches start of each line",
            pattern: @"^\w+",
            input: multiline,
            options: RegexOptions.Multiline);

        // ────────────────────────────────────────────────────────────────
        // 3.2  CAPTURING GROUPS
        // ────────────────────────────────────────────────────────────────
        Section("3.2 Capturing Groups — Extract parts of a match with (...)");

        ShowExample(
            "Extract area code and number from phone",
            pattern: @"\((\d{3})\)\s*(\d{3}-\d{4})",
            input: "Call (555) 123-4567 today!");

        ShowExample(
            "Extract date parts: (month)/(day)/(year)",
            pattern: @"(\d{1,2})/(\d{1,2})/(\d{4})",
            input: "Date: 12/25/2024");

        ShowExample(
            "Extract key=value pairs",
            pattern: @"(\w+)=(\w+)",
            input: "name=John age=30 city=NYC");

        // ────────────────────────────────────────────────────────────────
        // 3.3  NON-CAPTURING GROUPS
        // ────────────────────────────────────────────────────────────────
        Section("3.3 Non-Capturing Groups — Group without capturing with (?:...)");

        Note("Use (?:...) when you need grouping for quantifiers or alternation but don't need the captured value.");

        ShowExample(
            "Capturing group: (https?) captures the protocol",
            pattern: @"(https?)://(\w+\.\w+)",
            input: "Visit https://example.com");

        ShowExample(
            "Non-capturing: (?:https?) groups but doesn't capture",
            pattern: @"(?:https?)://(\w+\.\w+)",
            input: "Visit https://example.com");

        Note("Notice the non-capturing version has one fewer group in the output.");

        // ────────────────────────────────────────────────────────────────
        // 3.4  ALTERNATION — THE OR OPERATOR
        // ────────────────────────────────────────────────────────────────
        Section("3.4 Alternation — Match this OR that with |");

        ShowExample(
            "cat|dog — Match either 'cat' or 'dog'",
            pattern: "cat|dog",
            input: "I have a cat and a dog");

        ShowExample(
            "Combine with groups: (Mon|Tues|Wednes)day",
            pattern: "(Mon|Tues|Wednes)day",
            input: "Monday Tuesday Wednesday Thursday");

        ShowExample(
            "File extensions: \\.(jpg|png|gif)$",
            pattern: @"\.(jpg|png|gif)$",
            input: "photo.jpg",
            options: RegexOptions.IgnoreCase);

        // ────────────────────────────────────────────────────────────────
        // 3.5  REPLACE WITH CAPTURED GROUPS
        // ────────────────────────────────────────────────────────────────
        Section("3.5 Replace with Group References — $1, $2");

        ShowReplace(
            "Reformat date from MM/DD/YYYY to YYYY-MM-DD",
            pattern: @"(\d{2})/(\d{2})/(\d{4})",
            input: "12/25/2024",
            replacement: "$3-$1-$2");

        ShowReplace(
            "Swap first and last name",
            pattern: @"(\w+)\s+(\w+)",
            input: "John Smith",
            replacement: "$2, $1");

        ShowReplace(
            "Wrap each word in brackets",
            pattern: @"(\w+)",
            input: "hello world",
            replacement: "[$1]");

        // ────────────────────────────────────────────────────────────────
        // 3.6  BACKREFERENCES — MATCH THE SAME TEXT AGAIN
        // ────────────────────────────────────────────────────────────────
        Section("3.6 Backreferences — Match previously captured text with \\1");

        ShowExample(
            @"Find doubled words: (\w+)\s+\1",
            pattern: @"\b(\w+)\s+\1\b",
            input: "This is is a test test of doubled words words");

        ShowExample(
            @"Match repeated characters: (.)\1+",
            pattern: @"(.)\1+",
            input: "aabbccdddeee hello");

        ShowExample(
            "Match matching HTML tags: <(\\w+)>.*?</\\1>",
            pattern: @"<(\w+)>.*?</\1>",
            input: "<b>bold</b> and <i>italic</i>");
    }
}
