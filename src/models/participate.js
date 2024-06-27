const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Participate = sequelize.define(
    "participate",
    {
      part_Id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      participant_apply_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      participant_status: {
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

  sequelize
    .sync()
    .then(() =>
      console.log("Table `Participate` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return Participate;
};
