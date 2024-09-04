const db = require("../models/index");
const passport = require("passport");
const config = require("../configs/auth.config");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log("JWT Payload:", jwt_payload);

      if (!jwt_payload || !jwt_payload.users_id) {
        return done(new Error("Payload ไม่สมบูรณ์"), null);
      }

      const user = await db.user.findOne({
        where: { users_id: jwt_payload.users_id },
      });

      if (!user) {
        return done(new Error("ไม่พบผู้ใช้ในระบบ"), null);
      }

      return done(null, user);
    } catch (error) {
      console.error("Error in JWT strategy:", error);
      return done(error);
    }
  })
);

module.exports.isLogin = passport.authenticate("jwt", { session: false });
