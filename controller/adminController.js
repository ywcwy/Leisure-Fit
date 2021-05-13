const db = require('../models')
const { Leisurefit, Category, Like } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
client.on('uploadProgress', (progress) => console.log(progress))

const adminController = {
  getLeisurefits: async (req, res) => {
    try {
      let leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
      leisurefits = await Promise.all(leisurefits.map(async (l) => {
        const { count } = await Like.findAndCountAll({ where: { LeisurefitId: l.id } })
        return {
          ...l,
          createdAt: formatDate(l.createdAt),
          likes: count
        }
      }))
      return res.render('admin/leisurefits', { leisurefits })
    } catch (error) { console.log(error) }
  },
  createLeisurefit: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true })
      const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true })
      return res.render('admin/leisurefitCreate', { categories, leisurefit })
    } catch (error) { console.log(error) }
  },
  postLeisurefit: async (req, res) => {
    try {
      let { categoryId, name, description } = req.body
      let img = ''
      if (req.file) { img = await client.upload(req.file.path) }
      // console.log('********')
      // console.log(description)
      // description = description.replace('\n', '<br />')
      await Leisurefit.create({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : '' })
      req.flash('success_msg', '貼文新增成功')
      return res.redirect(`/admin/leisurefits`)
    } catch (error) { console.log(error) }
  },
  getLeisurefit: async (req, res) => {
    try {
      const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      leisurefit.createdAt = formatDate(leisurefit.createdAt)
      leisurefit.description = leisurefit.description.replace(/\r?\n/g, '<br />')
      return res.render('admin/leisurefit', { leisurefit })
    } catch (error) { console.log(error) }
  },
  putLeisurefit: async (req, res) => {
    try {
      const leisurefit = await Leisurefit.findByPk(req.params.id, { include: [Category] })
      let { categoryId, name, description } = req.body
      // console.log('********')
      // console.log(description)
      // description = description.replace(/\n/g, '<br />')
      // console.log('^^^^^^^^^^^')
      // console.log(description)
      let img = leisurefit.image
      if (req.file) { img = await client.upload(req.file.path) }
      await leisurefit.update({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : leisurefit.image })
      req.flash('success_msg', '貼文編輯成功')
      return res.redirect(`/admin/leisurefits/${req.params.id}`)
    } catch (error) { console.log(error) }
  },
  deleteLeisurefit: async (req, res) => {
    try {
      await Leisurefit.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '貼文刪除成功')
      return res.redirect('/admin/leisurefits')
    } catch (error) { console.log(error) }
  }
}

module.exports = adminController