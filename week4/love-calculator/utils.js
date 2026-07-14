export default function generateLoveScore() {
  return Math.floor(Math.random() * 100) + 1;
}

export function getLoveMessage(score) {
  if (score >= 1 && score <= 30) {
    return "Not a great match 😢";
  } else if (score <= 70) {
    return "Could work 🙂";
  } else {
    return "Perfect match ❤️";
  }
}
