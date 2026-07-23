import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TodoItem = sequelize.define(
  "TodoItem",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUrgent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
  },
);
