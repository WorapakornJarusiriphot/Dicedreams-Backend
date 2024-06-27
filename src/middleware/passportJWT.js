const db = require("../models/index");
const passport = require('passport');
const config = require('../configs/auth.config'); 

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => { 
    try {
        console.log(jwt_payload);
        const user = await db.user.findOne({
            where: {
            users_id: jwt_payload.users_id,
            },
        });

       if (!user) { 
           return done(new Error('ไม่พบผู้ใช้ในระบบ'), null);
       }

       return done(null, user);

    } catch (error) {
        done(error);
    }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false });