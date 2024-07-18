const { DataTypes } = require("sequelize");
const { generateRandomId } = require("../utils/generateRandomId");

module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define(
    "chat",
    {
      chat_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        defaultValue: generateRandomId,
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      datetime_chat: {
        type: DataTypes.STRING(20),
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
      post_games_id: {
        type: DataTypes.UUID,
        references: {
          model: "post_games",
          key: "post_games_id",
        },
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  // เพิ่มการเชื่อมต่อความสัมพันธ์กับ user
  Chat.associate = (models) => {
    Chat.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  sequelize
    .sync()
    .then(() => console.log("Table `chat` has been created successfully."))
    .catch((error) => console.error("This error occurred", error));

  return Chat;
};
