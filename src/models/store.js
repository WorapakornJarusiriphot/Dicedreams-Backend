const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define(
    "store",
    {
      store_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name_store: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      house_number: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      alley: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      road: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sub_district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      store_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "users_id",
        },
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  sequelize
    .sync()
    .then(() => console.log("Table `store` has been created successfully."))
    .catch((error) => console.error("This error occurred", error));

  return Store;
};
