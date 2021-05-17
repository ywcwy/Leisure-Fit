const db = require('../models')
const { Enroll, Trainingday, WaitingList, Category, User } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')
const { pushMessage } = require('../config/lineBot')


const enrollController = {
  enrollCourse: async (req, res) => {
    const [alreadyEnroll, alreadyOnWaitingList] = await Promise.all([
      Enroll.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } }),
      WaitingList.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } }),
    ])
    if (alreadyEnroll || alreadyOnWaitingList) {   // 確認是否已在正、備取名單
      return res.redirect('back')
    }
    const enroll = await helper.getEnroll(req.user.id, req.params.id) // 報名課程
    req.flash(enroll.flash, enroll.message)
    return res.redirect('back')
  },
  cancelEnroll: async (req, res) => {  // 取消正取
    // 取消正取＆拿到取消的人的資料
    const { user, day } = await helper.cancelEnroll(req.user.id, req.params.id)
    req.flash('success_msg', `已取消  ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    // 如果目前有備取名單，備取第一位要改為正取
    helper.switchToEnroll(req.params.id, user.name, day)
    return res.redirect('back')
  },
  cancelWaiting: async (req, res) => {   // 取消備取
    const { user, day } = await helper.cancelWaiting(req.user.id, req.params.id)
    req.flash('success_msg', `已取消 ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    return res.redirect('back')
  }
}


const helper = {
  getAllData: async (userId, trainingdayId) => {
    const [user, trainingday, enrollCount, waitingCount] = await Promise.all([
      User.findByPk(userId),
      Trainingday.findByPk(trainingdayId, { include: [Category], raw: true, nest: true }),
      Enroll.count({ where: { TrainingdayId: trainingdayId } }),    // 目前正取人數
      WaitingList.count({ where: { TrainingdayId: trainingdayId } })   // 目前備取人數
    ])
    return { user, trainingday, enrollCount, waitingCount }
  },
  getEnroll: async (userId, trainingdayId) => {
    const { user, trainingday, enrollCount, waitingCount } = await helper.getAllData(userId, trainingdayId)
    const { limitNumber, date, time } = trainingday
    const day_CH = trainingday.Category.day_CH
    if (enrollCount < limitNumber) {    // 目前該堂正取人數尚未額滿
      await Enroll.create({ UserId: userId, TrainingdayId: trainingdayId })
      if (user.lineUserId) {
        pushMessage(user.lineUserId, `${user.name} 已成功報名 ${formatDate(date)} (${day_CH}) ${formatTime(time)} 課程。 `)
      }
      return { flash: 'success_msg', message: `${user.name} 已成功報名 ${formatDate(date)} (${day_CH}) ${formatTime(time)} 課程。` }
    } else if (enrollCount === limitNumber) {
      if (waitingCount < limitNumber) {   // 目前該堂正取人數剛好額滿、備取名單尚未額滿
        await WaitingList.create({ UserId: userId, TrainingdayId: trainingdayId })
        if (user.lineUserId) {
          pushMessage(user.lineUserId, ` ${user.name} 已備取 ${formatDate(date)} (${day_CH}) ${formatTime(time)} 課程。`)
        }
        return { flash: 'success_msg', message: ` ${user.name} 已備取 ${formatDate(date)} (${day_CH}) ${formatTime(time)} 課程。` }
      }
    } else if (enrollCount >= limitNumber && waitingCount >= limitNumber) {  // 報名額滿，備取已額滿
      return { flash: 'success_msg', message: `${formatDate(date)} (${day_CH}) ${formatTime(time)} 目前正備取都已額滿，無法報名。` }
    }
  },
  switchToEnroll: async (trainingdayId, name, day) => {
    const onWaiting = await WaitingList.findOne({ where: { trainingdayId }, order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday] })
    if (onWaiting) {
      const [destroyWaiting, createEnroll, getEnroll] = await Promise.all([
        WaitingList.destroy({ where: { UserId: onWaiting.UserId, TrainingdayId: trainingdayId } }),
        Enroll.create({ UserId: onWaiting.UserId, TrainingdayId: onWaiting.TrainingdayId }), User.findByPk(onWaiting.UserId)])
      if (getEnroll.lineUserId) {
        pushMessage(getEnroll.lineUserId, ` ${name} 報名的 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程，您已由備取轉為正取。`)
      }
    }
  },
  cancelEnroll: async (userId, trainingdayId) => {
    const [day, user, cancel] = await Promise.all([
      Trainingday.findByPk(trainingdayId, { include: [Category], raw: true, nest: true }),
      User.findByPk(userId), Enroll.destroy({ where: { UserId: userId, TrainingdayId: trainingdayId } })
    ])
    if (user.lineUserId) {
      pushMessage(user.lineUserId, `已取消  ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    return { user, day }
  },
  cancelWaiting: async (userId, trainingdayId) => {
    const [day, user, cancel] = await Promise.all([
      Trainingday.findByPk(trainingdayId, { include: [Category], raw: true, nest: true }),
      User.findByPk(userId), WaitingList.destroy({ where: { UserId: userId, TrainingdayId: trainingdayId } })])
    if (user.lineUserId) {
      pushMessage(user.lineUserId, `已取消 ${user.name} 報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    return { user, day }
  }
}


module.exports = enrollController
