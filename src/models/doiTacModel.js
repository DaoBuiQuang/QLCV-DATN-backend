import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { QuocGia } from "./quocgiaModel.js";
export const DoiTac = sequelize.define(
  "DoiTac",
  {
    maDoiTac: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tenDoiTac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maQuocGia: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: QuocGia,
        key: "MaQuocGia",
    },
    },
  },
  {
    timestamps: true,
    tableName: "DoiTac",
  }
);
