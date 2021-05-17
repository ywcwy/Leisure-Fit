const db = require('../models')
const { Category, Trainingday, Enroll, WaitingList, User } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')
const { pushMessage } = require('../config/lineBot')
const { Op } = require("sequelize")

const courseController = {
  // 開放/截止報名日期
  handleEnrollment: async (req, res) => {
    const trainingDay = await Trainingday.findByPk(req.params.id, { include: [Category] })
    const [day, users] = await Promise.all([trainingDay.update({ enroll: !trainingDay.enroll }), User.findAll({ where: { lineUserId: { [Op.ne]: null } }, attributes: ['lineUserId'], raw: true, nest: true })])
    if (day.enroll === false) {
      pushMessage(users, `已截止報名 ${formatDate(trainingDay.date)}（${trainingDay.Category.day_CH}）${formatTime(trainingDay.time)} 課程。`)
    } else {
      pushMessage(users, `已開放報名 ${formatDate(trainingDay.date)}（${trainingDay.Category.day_CH}）${formatTime(trainingDay.time)} 課程。`)
    }

    return res.redirect('back')
  },
  getEnrollers: async (req, res) => {
    const [trainingDay, enrollList, waitingList] = await Promise.all([
      Trainingday.findByPk(req.params.id, { include: [Category], raw: true, nest: true }),
      Enroll.findAll({ where: { TrainingdayId: req.params.id }, include: [User], raw: true, nest: true }),
      WaitingList.findAll({ where: { TrainingdayId: req.params.id }, include: [User], raw: true, nest: true })
    ])
    return res.render('admin/enrollers', { enrollList, waitingList, trainingDay, date: formatDate(trainingDay.date), time: formatTime(trainingDay.time), day: trainingDay.Category.day_CH })
  },
  deleteEnrollers: async (req, res) => {
    // 取消正取
    const { trainingdayId, userId } = req.params
    const enroll = await Enroll.findOne({ where: { TrainingdayId: trainingdayId, UserId: userId }, include: [User, { model: Trainingday, include: [Category] }], raw: true, nest: true })
    const { flash, message } = await helper.cancelEnroll(trainingdayId, userId, enroll)
    req.flash(flash, message)
    // 如果目前有備取名單，備取第一位要改為正取
    helper.switchToEnroll(trainingdayId, enroll)
    return res.redirect(`back`)
  },
  deleteWaitings: async (req, res) => {
    // 取消備取
    const { trainingdayId, userId } = req.params
    const cancelWaiting = await WaitingList.findOne({
      where: { TrainingdayId: trainingdayId, UserId: userId }, include: [User, { model: Trainingday, include: [Category] }], raw: true, nest: true
    })
    await WaitingList.destroy({ where: { UserId: userId, TrainingdayId: trainingdayId } })
    req.flash('success_msg', `已取消 ${cancelWaiting.User.name} 報名的 ${formatDate(cancelWaiting.Trainingday.date)} (${cancelWaiting.Trainingday.Category.day_CH}) ${formatTime(cancelWaiting.Trainingday.time)} 課程。`)
    return res.redirect(`back`)
  }
}


const helper = {
  cancelEnroll: async (trainingdayId, userId, enroll) => {
    await Enroll.destroy({ where: { TrainingdayId: trainingdayId, UserId: userId } })
    if (enroll.User.lineUserId) { // 傳到私人 line 上
      pushMessage(user.lineUserId, `已取消 ${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程。`)
    }
    return { flash: 'success_msg', message: `已取消 ${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程。` }
  },
  switchToEnroll: async (trainingdayId, enroll) => {
    const onWaiting = await WaitingList.findOne({
      where: { TrainingdayId: trainingdayId }, order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday]
    })
    if (onWaiting) {
      const { UserId, TrainingdayId } = onWaiting
      WaitingList.destroy({ where: { UserId, TrainingdayId } })
      const toEnroll = await Enroll.create({ UserId, TrainingdayId }, { include: [User] })
      if (toEnroll.lineUserId) {
        pushMessage(toEnroll.lineUserId, `${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程已由備取轉為正取。`)
      }
    }
  }
}

module.exports = courseController