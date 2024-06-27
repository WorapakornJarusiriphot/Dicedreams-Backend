const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      notification_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "users_id",
        },
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.UUID,
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
    .then(() =>
      console.log("Table `Notification` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return Notification;
};
