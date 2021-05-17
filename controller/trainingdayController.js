const db = require('../models')
const { Category, Trainingday, Enroll, WaitingList } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')

const trainingdayController = {
  getTrainingDays: async (req, res) => {
    const { categories, trainingdays } = await helper.getAllTrainingdays()
    let trainingday = {}
    if (req.params.id) {
      trainingday = await helper.getTrainingDayInfo(req.params.id)
    }
    return res.render('admin/courses', { trainingdays, categories, trainingday })
  },
  postTrainingDay: async (req, res) => {
    const { date, categoryId, time, limitNumber } = req.body
    try {
      await Trainingday.create({ date, CategoryId: Number(categoryId), time, limitNumber })
    } catch (error) {
      req.flash('warning_msg', '課程日新增失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '新增成功。')
    return res.redirect('back')
  },
  putTrainingDay: async (req, res) => {
    const { date, categoryId, time, limitNumber } = req.body
    try {
      await Trainingday.update({ date, CategoryId: Number(categoryId), time, limitNumber }, { where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '課程日修改失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '修改成功。')
    return res.redirect('/admin/courses/trainingdays')
  },
  deleteTrainingDay: async (req, res) => {
    try {
      await Trainingday.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '課程日刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '刪除成功。')
    return res.redirect('back')
  }
}

const helper = {
  getAllTrainingdays: async () => {
    let [categories, trainingdays] = await Promise.all([
      Category.findAll({ raw: true }), Trainingday.findAll({ raw: true, nest: true, include: [Category] })])
    trainingdays = await Promise.all(trainingdays.map(async (t) => {
      const [enrollNumbers, waitingNumbers] = await Promise.all([
        Enroll.count({ where: { TrainingdayId: t.id } }), WaitingList.count({ where: { TrainingdayId: t.id } })])
      return {
        ...t,
        date: formatDate(t.date),
        enrollNumbers,
        waitingNumbers,
        time: formatTime(t.time)
      }
    }))
    return { categories, trainingdays }
  },
  getTrainingDayInfo: async (trainingdayId) => {
    const trainingday = await Trainingday.findByPk(trainingdayId, { raw: true })
    trainingday.date = formatDate(trainingday.date)
    trainingday.time = formatTime(trainingday.time)
    return trainingday
  }
}

module.exports = trainingdayController