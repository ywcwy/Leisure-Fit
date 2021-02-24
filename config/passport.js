const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, (req, username, password, done) => {
  User.findOne({ where: { email: username } }).then(user => {
    if (!user) {
      return done(null, false, req.flash('warning_msg', '帳號輸入錯誤。'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log(password)
      return done(null, false, req.flash('warning_msg', '密碼輸入錯誤。'))
    }
    return done(null, user, req.flash('success_msg', '登入成功。'))
  })
}))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      user = user.toJSON()
      done(err, user)
    })
})

module.exports = passport
