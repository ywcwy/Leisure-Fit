const leisurefitController = {
  getLeisures: (req, res) => {
    return res.render('index')
  },
  googleMap: (req, res) => {
    return res.render('googleMap')
  }
}

module.exports = leisurefitController