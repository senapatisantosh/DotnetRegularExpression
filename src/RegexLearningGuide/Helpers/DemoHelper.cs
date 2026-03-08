using System.Text.RegularExpressions;

namespace RegexLearningGuide.Helpers;

/// <summary>
/// Utility methods to display regex results in a clean, educational format.
/// </summary>
public static class DemoHelper
{
    public static void ShowExample(string title, string pattern, string input,
        RegexOptions options = RegexOptions.None)
    {
        Console.WriteLine($"  ▸ {title}");
        Console.WriteLine($"    Pattern : {pattern}");
        Console.WriteLine($"    Input   : \"{input}\"");

        var regex = new Regex(pattern, options);
        var matches = regex.Matches(input);

        if (matches.Count == 0)
        {
            Console.WriteLine("    Result  : No match found");
        }
        else
        {
            foreach (Match match in matches)
            {
                Console.WriteLine($"    Match   : \"{match.Value}\" at index {match.Index}");

                // Show groups if there are capturing groups (skip group 0 = full match)
                if (match.Groups.Count > 1)
                {
                    for (int i = 1; i < match.Groups.Count; i++)
                    {
                        var group = match.Groups[i];
                        string name = group.Name == i.ToString() ? $"Group {i}" : $"Group '{group.Name}'";
                        Console.WriteLine($"              {name}: \"{group.Value}\"");
                    }
                }
            }
        }

        Console.WriteLine();
    }

    public static void ShowIsMatch(string title, string pattern, string input,
        RegexOptions options = RegexOptions.None)
    {
        Console.WriteLine($"  ▸ {title}");
        Console.WriteLine($"    Pattern : {pattern}");
        Console.WriteLine($"    Input   : \"{input}\"");
        Console.WriteLine($"    IsMatch : {Regex.IsMatch(input, pattern, options)}");
        Console.WriteLine();
    }

    public static void ShowReplace(string title, string pattern, string input,
        string replacement, RegexOptions options = RegexOptions.None)
    {
        Console.WriteLine($"  ▸ {title}");
        Console.WriteLine($"    Pattern     : {pattern}");
        Console.WriteLine($"    Input       : \"{input}\"");
        Console.WriteLine($"    Replacement : \"{replacement}\"");
        Console.WriteLine($"    Result      : \"{Regex.Replace(input, pattern, replacement, options)}\"");
        Console.WriteLine();
    }

    public static void ShowSplit(string title, string pattern, string input,
        RegexOptions options = RegexOptions.None)
    {
        Console.WriteLine($"  ▸ {title}");
        Console.WriteLine($"    Pattern : {pattern}");
        Console.WriteLine($"    Input   : \"{input}\"");
        var parts = Regex.Split(input, pattern, options);
        Console.WriteLine($"    Parts   : [{string.Join(", ", parts.Select(p => $"\"{p}\""))}]");
        Console.WriteLine();
    }

    public static void Section(string title)
    {
        Console.WriteLine($"  ── {title} ──");
        Console.WriteLine();
    }

    public static void Note(string text)
    {
        Console.WriteLine($"  💡 {text}");
        Console.WriteLine();
    }
}
