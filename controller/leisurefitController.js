const db = require('../models')
const { Leisurefit, Category } = db

const leisurefitController = {
  getLeisures: async (req, res) => {
    const leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
    return res.render('index', { leisurefits })
  },
  googleMap: (req, res) => {
    return res.render('googleMap')
  }
}

module.exports = leisurefitController

