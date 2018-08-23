const passport = require('passport')
const passportJWT = require('passport-jwt')

var env = process.env.NODE_ENV || 'development'
var config = require('../config/config')[env]

var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy
var params = {
  secretOrKey: config.jwtKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

var strategy = new JwtStrategy(params, async (token, done) => {
  return done(null, true)
})

// This verifies that the token sent by the user is valid
passport.use(strategy)
