// Gives every supplier a consistent little color tag, derived from its name,
// so the same supplier always shows up the same color across the app
// (list view, cards, product detail) without us having to store a color
// on the model. Basically a poor man's avatar-color trick.

const PALETTE = [
  { bg: "rgba(94, 234, 212, 0.14)", text: "#5eead4" }, // teal
  { bg: "rgba(96, 165, 250, 0.14)", text: "#60a5fa" }, // blue
  { bg: "rgba(250, 204, 21, 0.14)", text: "#facc15" }, // yellow
  { bg: "rgba(244, 114, 182, 0.14)", text: "#f472b6" }, // pink
  { bg: "rgba(167, 139, 250, 0.14)", text: "#a78bfa" }, // violet
  { bg: "rgba(74, 222, 128, 0.14)", text: "#4ade80" }, // green
  { bg: "rgba(251, 146, 60, 0.14)", text: "#fb923c" }, // orange
  { bg: "rgba(148, 163, 184, 0.16)", text: "#cbd5e1" }, // slate
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function tagColorFor(name) {
  if (!name) return PALETTE[PALETTE.length - 1];
  return PALETTE[hashString(name) % PALETTE.length];
}

// Short 3-letter code for compact badges, e.g. "Northwind Traders" -> "NOR"
export function shortCode(name) {
  if (!name) return "—";
  const cleaned = name.trim().replace(/[^a-zA-Z0-9 ]/g, "");
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return (
      words[0][0] +
      words[1][0] +
      (words[1][1] || words[0][1] || "")
    ).toUpperCase();
  }
  return cleaned.slice(0, 3).toUpperCase();
}

export function initials(name) {
  if (!name) return "?";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
