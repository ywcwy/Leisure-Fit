const db = require('../models')
const { Equipment } = db

const equipmentController = {
  getEquipments: async (req, res) => {
    const equipments = await Equipment.findAll({ raw: true })
    let equipment = {}
    if (req.params.id) { equipment = await Equipment.findByPk(req.params.id, { raw: true }) }
    return res.render('admin/courses', { equipments, equipment })
  },
  postEquipment: async (req, res) => {
    const { item, description } = req.body
    try {
      await Equipment.create({ item, description })
    } catch (error) {
      req.flash('warning_msg', '器材項目新增失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '器材新增成功。')
    return res.redirect('back')
  },
  putEquipment: async (req, res) => {
    const { item, description } = req.body
    try {
      await Equipment.update({ item, description }, { where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '器材項目更新失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '器材更新成功。')
    return res.redirect('/admin/courses/equipments')
  },
  deleteEquipment: async (req, res) => {
    try {
      await Equipment.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '器材項目刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '器材刪除成功。')
    return res.redirect('back')
  }
}

module.exports = equipmentController