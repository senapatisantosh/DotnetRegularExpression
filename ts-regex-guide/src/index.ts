// ============================================================================
// TypeScript Regular Expressions — Complete Learning Guide
// From Beginner to Advanced
// ============================================================================
// This program walks you through every major concept in JavaScript/TypeScript
// regular expressions with clear examples, explanations, and output.
//
// How to run:
//   npx tsx src/index.ts              (run all levels)
//   npx tsx src/index.ts 1            (run only Level 1)
//   npx tsx src/index.ts 1 2 3        (run levels 1, 2, and 3)
// ============================================================================

import { run as level1 } from "./levels/level1-beginner.js";
import { run as level2 } from "./levels/level2-elementary.js";
import { run as level3 } from "./levels/level3-intermediate.js";
import { run as level4 } from "./levels/level4-advanced.js";
import { run as level5 } from "./levels/level5-expert.js";
import { run as level6 } from "./levels/level6-master.js";

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  TypeScript Regular Expressions — Complete Learning Guide   ║");
console.log("╚══════════════════════════════════════════════════════════════╝");
console.log();

const allLevels: { title: string; run: () => void }[] = [
  { title: "Level 1: Beginner — First Steps with Regex", run: level1 },
  { title: "Level 2: Elementary — Character Classes & Quantifiers", run: level2 },
  { title: "Level 3: Intermediate — Groups, Anchors & Alternation", run: level3 },
  { title: "Level 4: Advanced — Lookahead, Lookbehind & Modern Flags", run: level4 },
  { title: "Level 5: Expert — Named Groups, Unicode & Advanced Techniques", run: level5 },
  { title: "Level 6: Master — Real-World Patterns & Performance", run: level6 },
];

// Parse which levels to run from command-line arguments
const args = process.argv.slice(2);
let selectedLevels: Set<number>;

if (args.length > 0) {
  selectedLevels = new Set(
    args
      .map((a) => parseInt(a, 10))
      .filter((n) => n >= 1 && n <= allLevels.length)
  );
} else {
  selectedLevels = new Set(allLevels.map((_, i) => i + 1));
}

for (let i = 0; i < allLevels.length; i++) {
  if (!selectedLevels.has(i + 1)) continue;

  console.log("┌──────────────────────────────────────────────────────────────┐");
  console.log(`│  ${allLevels[i].title.padEnd(59)}│`);
  console.log("└──────────────────────────────────────────────────────────────┘");
  console.log();

  allLevels[i].run();

  console.log();
  console.log("─".repeat(64));
  console.log();
}

console.log("🎓 Congratulations! You've completed the TypeScript Regex Learning Guide!");
