/**
 * One-Star Review of Something Essential — make.fun entry.
 *
 * Writes a single-line, one-star review (max 160 characters) to
 * /output/entry.txt. No dependencies, no network.
 */

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY =
  "One star. Gravity works, but there is no undo button and customer support has never once answered.";

const OUT_DIR = "/output";
const OUT_PATH = join(OUT_DIR, "entry.txt");

function validate(entry: string): void {
  const length = [...entry].length;
  if (length < 1 || length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${length}`);
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (entry.trim() !== entry) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

function main(): void {
  validate(ENTRY);
  mkdirSync(OUT_DIR, { recursive: true });
  const tmpPath = join(OUT_DIR, `.entry.txt.tmp-${process.pid}`);
  writeFileSync(tmpPath, ENTRY, "utf8");
  renameSync(tmpPath, OUT_PATH);
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  // Byte-level check: no trailing newline or extra bytes may sneak in.
  const raw = readFileSync(OUT_PATH);
  if (!raw.equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("byte-level read-back mismatch in entry.txt");
  }
  console.log(`wrote ${OUT_PATH} (${[...ENTRY].length} characters)`);
}

main();
