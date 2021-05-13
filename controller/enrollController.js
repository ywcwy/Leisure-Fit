const db = require('../models')
const { Enroll, Trainingday, WaitingList, Category, User } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')
const { pushMessage } = require('../config/lineBot')


const enrollController = {
  enrollCourse: async (req, res) => {
    const UserId = Number(req.user.id)
    const TrainingdayId = Number(req.params.id)
    const [user, trainingday, alreadyEnroll, alreadyOnWaitingList, enrollCount, waitingCount] = await Promise.all([
      User.findByPk(UserId),
      Trainingday.findByPk(TrainingdayId, { include: [Category], raw: true, nest: true }),
      Enroll.findOne({ where: { UserId, TrainingdayId } }),   // 確認是否已在正取名單
      WaitingList.findOne({ where: { UserId, TrainingdayId } }),   // 確認是否已在備取名單
      Enroll.count({ where: { TrainingdayId } }),    // 目前正取人數
      WaitingList.count({ where: { TrainingdayId } })   // 目前備取人數
    ])

    if (alreadyEnroll || alreadyOnWaitingList) {   // 確認是否已在正、備取名單
      return res.redirect('back')
    }

    const { limitNumber, date, time } = trainingday
    if (enrollCount < limitNumber) {    // 目前該堂正取人數尚未額滿
      await Enroll.create({ UserId, TrainingdayId })
      if (user.lineUserId) {
        pushMessage(user.lineUserId, `${user.name} 已成功報名 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。 `)  // 傳到私人 line 上
      }
      req.flash('success_msg', `${user.name} 已成功報名 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。`)
    } else if (enrollCount === limitNumber) {
      if (waitingCount < limitNumber) {   // 目前該堂正取人數剛好額滿、備取名單尚未額滿
        await WaitingList.create({ UserId, TrainingdayId })
        if (user.lineUserId) {
          pushMessage(user.lineUserId, ` ${user.name} 已備取 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。`)
        }
        req.flash('success_msg', ` ${user.name} 已備取 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。`)
      }
    } else if (enrollCount >= limitNumber && waitingCount >= limitNumber) {  // 報名額滿，備取已額滿
      req.flash('warning_msg', `${formatDate(date)} (${Category.day_CH}) ${formatTime(time)} 目前正備取都已額滿，無法報名。`)
    }
    return res.redirect('back')
  },
  cancelEnroll: async (req, res) => {  // 取消正取
    const UserId = Number(req.user.id)
    const TrainingdayId = Number(req.params.id)
    const [enroll, day, user] = await Promise.all([
      Enroll.destroy({ where: { UserId, TrainingdayId } }),
      Trainingday.findByPk(TrainingdayId, { include: [Category], raw: true, nest: true }),
      User.findByPk(UserId)
    ])
    if (user.lineUserId) {
      pushMessage(user.lineUserId, `已取消  ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    req.flash('success_msg', `已取消  ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)

    // 如果目前有備取名單，備取第一位要改為正取
    const onWaiting = await WaitingList.findOne({ where: { TrainingdayId }, order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday] })
    if (onWaiting) {
      const [destroyWaiting, createEnroll, getEnroll] = await Promise.all([
        WaitingList.destroy({ where: { UserId: onWaiting.UserId, TrainingdayId: onWaiting.TrainingdayId } }),
        Enroll.create({ UserId: onWaiting.UserId, TrainingdayId: onWaiting.TrainingdayId }), User.findByPk(onWaiting.UserId)])
      if (getEnroll.lineUserId) {
        pushMessage(getEnroll.lineUserId, ` ${user.name} 報名的 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程，您已由備取轉為正取。`)
      }
    }
    return res.redirect('back')
  },
  cancelWaiting: async (req, res) => {   // 取消備取
    const [destroyWaiting, day, user] = await Promise.all([WaitingList.destroy({ where: { UserId: req.user.id, TrainingdayId: req.params.id } }),
    Trainingday.findByPk(req.params.id, { include: [Category], raw: true, nest: true }), User.findByPk(UserId)])
    if (user.lineUserId) {
      pushMessage(user.lineUserId, `已取消 ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    req.flash('success_msg', `已取消 ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    return res.redirect('back')
  }
}



module.exports = enrollController
