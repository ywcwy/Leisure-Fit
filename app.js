const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')
const app = express()
const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(routes)


app.listen(3000, () => console.log(`app now is running on ${PORT}.`))

module.exports = app