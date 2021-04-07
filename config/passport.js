const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const LineStrategy = require('passport-line').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findOne({ where: { email: username } }).then(user => {
    if (!user) {
      return done(null, false, req.flash('warning_msg', '帳號輸入錯誤。'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, req.flash('warning_msg', '密碼輸入錯誤。'))
    }
    return done(null, user, req.flash('success_msg', '登入成功。'))
  })
}))

passport.use(new LineStrategy({
  channelID: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELID,
  channelSecret: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELSECRET,
  callbackURL: process.env.LINECORP_PLATFORM_CHANNEL_CALLBACKURL,
  scope: ['profile', 'openid', 'email'],
  botPrompt: 'normal'
}, (accessToken, refreshToken, parameter, profile, cb) => {
  console.log(parameter)
  const { email } = jwt.decode(param.id_token)
  profile.email = email
  return cb(null, profile)
  // User.findOrCreate({ id: profile.id }, (err, user) => {
  //   return done(err, user)
  // })
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      done(null, user)
    })
})

module.exports = passport