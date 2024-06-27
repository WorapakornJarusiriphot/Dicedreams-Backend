require('dotenv').config();

module.exports = {
    secret : process.env.JWT_SECRET,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION),
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION)
}