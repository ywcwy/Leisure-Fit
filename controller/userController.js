const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const userController = {
  registerPage: (req, res) => { res.render('register') },
  register: (req, res) => {
    const { name, email, password } = req.body
    User.create({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(user => { return res.redirect('/login') })
  },
  logInPage: (req, res) => { res.render('login') },
  logIn: (req, res) => {
    const { email, password } = req.body
    User.findOne({ where: email })
      .then(user => {
        console.log(user)
        if (!user || user.password !== password) { return res.redirect('back') }
        return res.redirect('/index')
      })
  }
}
module.exports = userController
