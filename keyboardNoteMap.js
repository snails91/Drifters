/**
 * Printable-key (US layout) `KeyboardEvent.key` -> note name mapping.
 * Intended for simple musical prototyping: call `keyToNote(e.key)` on keydown.
 *
 * Notes are centered around octave 4, digits trend brighter (octave 5),
 * punctuation lives mostly in octave 3, and letters are grouped phonetically.
 */

export const KEY_TO_NOTE = Object.freeze({
  // -----------------------------
  // Letters (phonetic-ish groups)
  // -----------------------------
  a: "A4",
  b: "B4",
  c: "C4",
  d: "D4",
  e: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  i: "E4",
  j: "G4",
  k: "C4",
  l: "A#4",
  m: "B3",
  n: "C4",
  o: "G#4",
  p: "B4",
  q: "C4",
  r: "D#4",
  s: "C#4",
  t: "F#4",
  u: "A4",
  v: "B4",
  w: "B4",
  x: "D#4",
  y: "F4",
  z: "D4",

  // --------------
  // Digits (bright)
  // --------------
  "1": "C5",
  "2": "C#5",
  "3": "D5",
  "4": "D#5",
  "5": "E5",
  "6": "F5",
  "7": "F#5",
  "8": "G5",
  "9": "G#5",
  "0": "A5",

  // Shifted digit symbols (same notes as digits)
  "!": "C5",
  "@": "C#5",
  "#": "D5",
  $: "D#5",
  "%": "E5",
  "^": "F5",
  "&": "F#5",
  "*": "G5",
  "(": "G#5",
  ")": "A5",

  // -----------------------------------------
  // Punctuation / symbols (mostly lower bank)
  // -----------------------------------------
  "`": "G#3",
  "~": "A3",

  "-": "A#3",
  _: "B3",
  "=": "C3",
  "+": "C#3",

  "[": "D3",
  "{": "D#3",
  "]": "E3",
  "}": "F3",
  "\\": "F#3",
  "|": "G3",

  ";": "G#3",
  ":": "A3",
  "'": "A#3",
  '"': "B3",

  ",": "C3",
  "<": "C#3",
  ".": "D3",
  ">": "D#3",
  "/": "E3",
  "?": "F3",

  // Whitespace
  " ": "C2",
});

/**
 * Convert `KeyboardEvent.key` (or any string) to a note name.
 * Returns `null` for non-printable / unmapped keys.
 */
export function keyToNote(key) {
  if (typeof key !== "string" || key.length === 0) return null;
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  return KEY_TO_NOTE[normalized] ?? null;
}

// Optional CJS compatibility for quick Node experiments.
// (Safe in browsers: `module` is typically undefined.)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { KEY_TO_NOTE, keyToNote };
}

