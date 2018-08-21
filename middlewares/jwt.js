const passport = require("passport");
const passportJWT = require("passport-jwt");
const nconf = require('../config');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var params = {
    secretOrKey: nconf.get('jwtKey'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

var strategy = new JwtStrategy(params, async (token, done) => {
    return done(null, true);
});

//This verifies that the token sent by the user is valid
passport.use(strategy);
