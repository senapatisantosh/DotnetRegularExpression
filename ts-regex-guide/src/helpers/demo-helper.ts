// ============================================================================
// Demo Helper — Utility functions for displaying regex results clearly
// ============================================================================

export function section(title: string): void {
  console.log(`  ── ${title} ──`);
  console.log();
}

export function note(text: string): void {
  console.log(`  💡 ${text}`);
  console.log();
}

export function showExample(
  title: string,
  pattern: RegExp,
  input: string
): void {
  console.log(`  ▸ ${title}`);
  console.log(`    Pattern : ${pattern}`);
  console.log(`    Input   : "${input}"`);

  const matches = [...input.matchAll(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"))];

  if (matches.length === 0) {
    console.log(`    Result  : No match found`);
  } else {
    for (const match of matches) {
      console.log(`    Match   : "${match[0]}" at index ${match.index}`);

      // Show numbered groups
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          console.log(`              Group ${i}: "${match[i]}"`);
        }
      }

      // Show named groups
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          if (value !== undefined) {
            console.log(`              Group '${name}': "${value}"`);
          }
        }
      }
    }
  }

  console.log();
}

export function showTest(
  title: string,
  pattern: RegExp,
  input: string
): void {
  console.log(`  ▸ ${title}`);
  console.log(`    Pattern : ${pattern}`);
  console.log(`    Input   : "${input}"`);
  console.log(`    Test    : ${pattern.test(input)}`);
  console.log();
}

export function showReplace(
  title: string,
  pattern: RegExp,
  input: string,
  replacement: string | ((substring: string, ...args: any[]) => string)
): void {
  console.log(`  ▸ ${title}`);
  console.log(`    Pattern     : ${pattern}`);
  console.log(`    Input       : "${input}"`);
  if (typeof replacement === "string") {
    console.log(`    Replacement : "${replacement}"`);
    console.log(`    Result      : "${input.replace(pattern, replacement)}"`);
  } else {
    console.log(`    Replacement : <function>`);
    console.log(`    Result      : "${input.replace(pattern, replacement)}"`);
  }
  console.log();
}

export function showSplit(
  title: string,
  pattern: RegExp,
  input: string
): void {
  console.log(`  ▸ ${title}`);
  console.log(`    Pattern : ${pattern}`);
  console.log(`    Input   : "${input}"`);
  const parts = input.split(pattern);
  console.log(`    Parts   : [${parts.map((p) => `"${p}"`).join(", ")}]`);
  console.log();
}
