const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const userController = {
  registerPage: (req, res) => { return res.render('register') },
  register: async (req, res) => {
    try {
      const { name, email, password, passwordConfirm } = req.body
      if (!password || !name || !email || !passwordConfirm) {
        req.flash('warning_msg', '所有欄位都是必填。')
        return res.render('register', { name, email, password, passwordConfirm })
      }
      const user = await User.findOne({ where: { email } })
      if (user) {
        const error = [{ message: '此email已註冊過。' }]
        return res.render('register', { error, name, email })
      }
      if (password !== passwordConfirm) {
        const error = [{ message: '密碼與確認密碼不相符。' }]
        return res.render('register', { error, name, email })
      }
      await User.create({
        name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      req.flash('success_msg', '帳號註冊成功。')
      return res.redirect('/login')
    } catch (error) { console.log(error) }
  },
  logInPage: (req, res) => { return res.render('login') },
  logIn: (req, res) => {
    req.flash('success_msg', '成功登入。')
    return res.redirect('/')
  },
  logOut: (req, res) => {
    req.flash('success_msg', '成功登出。')
    req.logout()
    return res.redirect('/login')
  }
}
module.exports = userController
