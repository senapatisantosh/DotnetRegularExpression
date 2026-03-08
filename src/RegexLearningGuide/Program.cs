// ============================================================================
// .NET Regular Expressions - Complete Learning Guide
// From Beginner to Advanced
// ============================================================================
// This program walks you through every major concept in .NET regular
// expressions with clear examples, explanations, and output.
//
// How to run:
//   dotnet run
//   dotnet run -- 1        (run only Level 1)
//   dotnet run -- 1 2 3    (run levels 1, 2, and 3)
// ============================================================================

using RegexLearningGuide.Levels;

Console.WriteLine("╔══════════════════════════════════════════════════════════════╗");
Console.WriteLine("║     .NET Regular Expressions - Complete Learning Guide      ║");
Console.WriteLine("╚══════════════════════════════════════════════════════════════╝");
Console.WriteLine();

var allLevels = new (string Title, Action Run)[]
{
    ("Level 1: Beginner - First Steps with Regex", Level1_Beginner.Run),
    ("Level 2: Elementary - Character Classes & Quantifiers", Level2_Elementary.Run),
    ("Level 3: Intermediate - Groups, Anchors & Alternation", Level3_Intermediate.Run),
    ("Level 4: Advanced - Lookahead, Lookbehind & Backreferences", Level4_Advanced.Run),
    ("Level 5: Expert - Named Groups, Balancing Groups & Compilation", Level5_Expert.Run),
    ("Level 6: Master - Real-World Patterns & Performance", Level6_Master.Run),
};

// Parse which levels to run from command-line arguments
HashSet<int> selectedLevels;
if (args.Length > 0)
{
    selectedLevels = args
        .Select(a => int.TryParse(a, out var n) ? n : -1)
        .Where(n => n >= 1 && n <= allLevels.Length)
        .ToHashSet();
}
else
{
    selectedLevels = Enumerable.Range(1, allLevels.Length).ToHashSet();
}

for (int i = 0; i < allLevels.Length; i++)
{
    if (!selectedLevels.Contains(i + 1)) continue;

    Console.WriteLine($"┌──────────────────────────────────────────────────────────────┐");
    Console.WriteLine($"│  {allLevels[i].Title,-59}│");
    Console.WriteLine($"└──────────────────────────────────────────────────────────────┘");
    Console.WriteLine();

    allLevels[i].Run();

    Console.WriteLine();
    Console.WriteLine(new string('─', 64));
    Console.WriteLine();
}

Console.WriteLine("🎓 Congratulations! You've completed the .NET Regex Learning Guide!");
