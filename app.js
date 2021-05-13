const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./models')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const app = express()

const port = process.env.PORT || 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/upload', express.static(__dirname + '/upload'))
app.use(flash())

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  next()
})

app.use(routes)
app.listen(port, () => console.log(`app now is running on ${port}.`))


module.exports = app