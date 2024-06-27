const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostGames = sequelize.define(
    "post_games",
    {
      post_games_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name_games: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      num_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_meet: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time_meet: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      games_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      creation_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
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
      timestamps: false,
    }
  );

  sequelize
    .sync()
    .then(() =>
      console.log("Table `post_games` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostGames;
};
