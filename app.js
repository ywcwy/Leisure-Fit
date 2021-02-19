const express = require('express')
const exphbs = require('express-handlebars')
const router = express.Router()
const app = express()
const PORT = 3000



app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => res.send('hi'))

app.listen(3000, () => console.log(`app now is running on ${PORT}.`))