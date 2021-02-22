const express = require('express')
const exphbs = require('express-handlebars')
require('./models')
const bodyParser = require('body-parser')
const routes = require('./routes')
const app = express()
const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.listen(3000, () => console.log(`app now is running on ${PORT}.`))

module.exports = app