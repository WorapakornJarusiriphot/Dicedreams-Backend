// create config file for auth
module.exports = {
    secret : "worapakorn-secret-key",
    
    // jwtExpiration:3600, // 1 hour
    // jwtRefreshExpiration:86400, //24 hours
    
    /* For test*/
    jwtExpiration:60, // 1 minute
    jwtRefreshExpiration:120, //2 minute
   
}

