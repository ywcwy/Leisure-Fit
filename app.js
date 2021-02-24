const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
require('./models')
const routes = require('./routes')
const app = express()
const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  console.log(req)
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  next()
})
passport.use(app)
app.use(routes)
app.listen(3000, () => console.log(`app now is running on ${PORT}.`))


module.exports = app