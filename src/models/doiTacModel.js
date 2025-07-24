import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { QuocGia } from "./quocGiaModel.js";
import { addAuditHooks } from "./addAuditHooks.js";
export const DoiTac = sequelize.define(
  "DoiTac",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    maDoiTac: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
addAuditHooks(DoiTac);