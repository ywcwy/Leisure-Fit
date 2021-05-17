const db = require('../models')
const { Leisurefit, Category, Like } = db
const { formatDate } = require('../config/formatDate&Time')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
client.on('uploadProgress', (progress) => console.log(progress))

const adminController = {
  getLeisurefits: async (req, res) => {
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
  },
  createLeisurefit: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true })
    return res.render('admin/leisurefitCreate', { categories, leisurefit })
  },
  postLeisurefit: async (req, res) => {
    let { categoryId, name, description } = req.body
    let img = ''
    if (req.file) {
      try {
        img = await client.upload(req.file.path)
      } catch (error) {
        req.flash('warning_msg', '照片上傳失敗，請選擇其他照片')
        return res.redirect('back')
      }
    }
    try {
      await Leisurefit.create({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : '' })
    } catch (error) {
      req.flash('warning_msg', 'po文失敗')
      return res.redirect('back')
    }

    req.flash('success_msg', '貼文新增成功')
    return res.redirect(`/admin/leisurefits`)
  },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    leisurefit.createdAt = formatDate(leisurefit.createdAt)
    leisurefit.description = leisurefit.description.replace(/\r?\n/g, '<br />')
    return res.render('admin/leisurefit', { leisurefit })
  },
  putLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { include: [Category] })
    let { categoryId, name, description } = req.body
    let img = leisurefit.image
    if (req.file) {
      try {
        img = await client.upload(req.file.path)
      } catch (error) {
        req.flash('warning_msg', '照片上傳失敗')
        return res.redirect('back')
      }
    }

    try {
      await leisurefit.update({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : leisurefit.image })
    } catch (error) {
      req.flash('warning_msg', '編輯儲存失敗')
      return res.redirect('back')
    }

    req.flash('success_msg', '貼文編輯成功')
    return res.redirect(`/admin/leisurefits/${req.params.id}`)
  },
  deleteLeisurefit: async (req, res) => {
    try {
      await Leisurefit.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '貼文刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '貼文刪除成功')
    return res.redirect('/admin/leisurefits')
  }
}

module.exports = adminController