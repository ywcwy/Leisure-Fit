const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const LineStrategy = require('passport-line').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Leisurefit } = db

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const user = await User.findOne({ where: { email: username } })
    if (!user) {
      return done(null, false, req.flash('warning_msg', '帳號輸入錯誤。'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, req.flash('warning_msg', '密碼輸入錯誤。'))
    }
    return done(null, user, req.flash('success_msg', '登入成功。'))
  } catch (error) { console.log(error) }
}))

passport.use(new LineStrategy({
  channelID: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELID,
  channelSecret: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELSECRET,
  callbackURL: process.env.LINECORP_PLATFORM_CHANNEL_CALLBACKURL,
  scope: ['profile', 'openid', 'email'],
  botPrompt: 'normal'
}, async (accessToken, refreshToken, params, profile, done) => {
  try {
    const { name, email } = jwt.decode(params.id_token)
    profile.email = email
    const user = await User.findOne({ where: { email } })
    if (user) { return done(null, user) }
    const randomPassword = Math.random().toString(36).slice(-8)
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hashSync(randomPassword, salt)
    await User.create({ name, email, password: hash })
    return done(null, user)
  } catch (error) { done(err, false) }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findByPk(id, { include: [{ model: Leisurefit, as: 'LikedLeisurefits' }] })
    if (user) {
      user = user.toJSON()
      return done(null, user)
    }
  } catch (error) { done(err, false) }
})

module.exports = passport