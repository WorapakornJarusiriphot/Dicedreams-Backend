const config = require("../configs/db.config")

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host:config.HOST,
    dialect: config.dialect,
    // dialectOptions:{
    //     ssl:{
    //         required:false,
    //         rejectUnauthorized:false
    //     }
    // },
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    }
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


// กำหนดความสัมพันธ์
db.user.hasOne(db.store, { foreignKey: 'users_id', as: 'store' });
db.store.belongsTo(db.user, { foreignKey: 'users_id' });


module.exports = db;