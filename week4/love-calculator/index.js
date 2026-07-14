import generateLoveScore, { getLoveMessage } from "./utils.js";
import chalk from "chalk";

const person1 = "Aamod";
const person2 = "Class";

const loveScore = generateLoveScore();
const message = getLoveMessage(loveScore);

console.log(chalk.magenta(`${person1} ❤️ ${person2}`));
console.log(chalk.green(`Love Score: ${loveScore}%`));
console.log(chalk.cyan(message));
