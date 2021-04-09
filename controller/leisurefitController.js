const db = require('../models')
const { Leisurefit, Category } = db

const leisurefitController = {
  getLeisures: async (req, res) => {
    let leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
    leisurefits = leisurefits.map(l => {
      return {
        ...l,
        description: l.description.substring(0, 50) + '...'
      }
    })
    return res.render('index', { leisurefits })
  },
  googleMap: (req, res) => {
    return res.render('googleMap')
  }
}

module.exports = leisurefitController

