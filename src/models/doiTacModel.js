import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { QuocGia } from "./quocGiaModel.js";
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
    maNhanSuCapNhap: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "DoiTac",
  }
);
// DoiTac.belongsTo(QuocGia, {
//   foreignKey: "maQuocGia",
//   as: "quocGia",
// });