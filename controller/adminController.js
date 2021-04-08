const db = require('../models')
const { Leisurefit, Category } = db

const imgur = require('imgur')


const adminController = {
  getLeisures: (req, res) => {
    Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
      .then(leisurefits => res.render('admin/leisurefits', { leisurefits }))
  },
  createLeisurefit: (req, res) => res.render('admin/create'),
  postLeisurefit: async (req, res) => {
    const { category, name, description, image } = req.body
    const classCategory = await Category.findOne({ name: category })
    const { file } = req
    imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    const img = await imgur.uploadFile(file.path)
    Leisurefit.create({ name, CategoryId: classCategory.id, description, image: img.link })
      .then(() => {
        req.flash('success_msg', '貼文新增成功')
        res.redirect('/admin/leisurefits')
      })
  }
}

module.exports = adminController