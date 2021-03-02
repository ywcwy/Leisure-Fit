const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const userController = {
  registerPage: (req, res) => { res.render('register') },
  register: (req, res) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!password || !name || !email || !passwordConfirm) {
      req.flash('warning_msg', '所有欄位都是必填。')
      return res.render('register', { name, email, password, passwordConfirm })
    }
    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          const error = [{ message: '此email已註冊過。' }]
          return res.render('register', { error, name, email })
        }
        if (password !== passwordConfirm) {
          const error = [{ message: '密碼與確認密碼不相符。' }]
          return res.render('register', { error, name, email })
        }
        User.create({
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        }).then(() => {
          req.flash('success_msg', '帳號註冊成功。')
          return res.redirect('/login')
        })
      })
  },
  logInPage: (req, res) => { res.render('login') },
  logIn: (req, res) => {
    req.flash('success_msg', '成功登入。')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_msg', '成功登出。')
    req.logout()
    res.redirect('/login')
  }
}
module.exports = userController
