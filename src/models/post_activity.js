const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostActivity = sequelize.define(
    "post_activity",
    {
      post_activity_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name_activity: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date_activity: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time_activity: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      post_activity_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: "store",
          key: "store_id",
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
      console.log("Table `post_activity` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostActivity;
};
