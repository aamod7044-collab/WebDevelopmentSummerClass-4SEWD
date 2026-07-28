import Todo from "./Todo.js";
import User from "./User.js";

User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

export { Todo, User };
