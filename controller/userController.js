const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const userController = {
  registerPage: (req, res) => { res.render('register') },
  register: (req, res) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!password || !name || !email || !passwordConfirm) {
      req.flash('warning_msg', '所有欄位都是必填。')
      return res.render('/register', { name, email, password, passwordConfirm })
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          req.flash('warning_msg', '此email已註冊過。')
          return res.render('/register', { name, email, password, passwordConfirm })
        } else if (password !== passwordConfirm) {
          req.flash('warning_msg', '密碼與確認密碼不相符。')
          return res.render('/register', { name, email })
        }
        User.create({
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
      }).then(() => res.redirect('/login'))
  },
  logInPage: (req, res) => { res.render('login') },
  logIn: (req, res) => {
    const { email, password } = req.body
    User.findOne({ email })
      .then(user => {
        console.log(user)
        if (!user || user.password !== password) { return res.redirect('back') }
        return res.redirect('/index')
      })
  }
}
module.exports = userController
