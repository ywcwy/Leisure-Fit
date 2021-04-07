const db = require('../models')
const imgur = require('imgur')
const adminController = {
  getLeisures: (req, res) => {
    res.render('admin/leisurefits')
  }
}

module.exports = adminController