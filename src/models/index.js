const config = require("../configs/db.config");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post_activity = require("./post_activity")(sequelize, Sequelize);
db.post_games = require("./post_games")(sequelize, Sequelize);
db.chat = require("./chat")(sequelize, Sequelize);
db.participate = require("./participate")(sequelize, Sequelize);
db.store = require("./store")(sequelize, Sequelize);
db.notification = require("./notification")(sequelize, Sequelize);

// กำหนดความสัมพันธ์ระหว่าง user และ store
db.user.hasOne(db.store, { foreignKey: "users_id", as: "store" });
db.store.belongsTo(db.user, { foreignKey: "users_id" });

// กำหนดความสัมพันธ์ระหว่าง participate และ user
db.participate.belongsTo(db.user, { foreignKey: "user_id", as: "user" });
db.user.hasMany(db.participate, { foreignKey: "user_id" });

// กำหนดความสัมพันธ์ระหว่าง chat และ user
db.chat.belongsTo(db.user, { foreignKey: "user_id", as: "user" });
db.user.hasMany(db.chat, { foreignKey: "user_id" });

module.exports = db;
