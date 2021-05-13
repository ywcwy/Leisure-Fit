const db = require('../models')
const { Enroll, Trainingday, WaitingList, Category, User } = db
const formatDate = require('../config/formatDate')
const formatTime = require('../config/formatTime')
const line = require('@line/bot-sdk')
const client = new line.Client({
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
})


const enrollController = {
  enrollCourse: async (req, res) => {
    const UserId = Number(req.user.id)
    const TrainingdayId = Number(req.params.id)
    const [user, trainingday] = await Promise.all([User.findByPk(UserId), Trainingday.findByPk(TrainingdayId, { include: [Category], raw: true, nest: true })])
    const { limitNumber, date, time } = trainingday
    // 確認是否已在正、備取名單
    const [alreadyEnroll, alreadyOnWaitingList] = await Promise.all([
      Enroll.findOne({ where: { UserId, TrainingdayId } }),
      WaitingList.findOne({ where: { UserId, TrainingdayId } })
    ])
    if (alreadyEnroll || alreadyOnWaitingList) {
      return res.redirect('back')
    }

    const [enrollCount, waitingCount] = await Promise.all([
      Enroll.count({ where: { TrainingdayId } }),    // 目前正取
      WaitingList.count({ where: { TrainingdayId } })  // 備取人數
    ])

    if (enrollCount < limitNumber) {    // 目前該堂正取人數尚未額滿
      await Enroll.create({ UserId, TrainingdayId })
      if (user.lineUserId) { // 傳到私人 line 上
        pushMessage(lineUserId, `已成功報名 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)}。 `)
      }
      req.flash('success_msg', `已成功報名 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 。`)
    } else if (enrollCount === limitNumber) {
      if (waitingCount < limitNumber) {   // 目前該堂正取人數剛好額滿、備取名單尚未額滿
        await WaitingList.create({ UserId, TrainingdayId })
        if (user.lineUserId) { // 傳到私人 line 上
          pushMessage(lineUserId, `已備取 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。`)
        }
        req.flash('success_msg', `已備取 ${formatDate(date)} (${trainingday.Category.day_CH}) ${formatTime(time)} 課程。`)
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
    if (user.lineUserId) { // 傳到私人 line 上
      pushMessage(lineUserId, `已取消報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    req.flash('success_msg', `已取消報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)

    // 如果目前有備取名單，備取第一位要改為正取
    const onWaiting = await WaitingList.findOne({ where: { TrainingdayId }, order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday] })
    if (onWaiting) {
      const [destroyWaiting, createEnroll, getEnroll] = await Promise.all([
        WaitingList.destroy({ where: { UserId: onWaiting.UserId, TrainingdayId: onWaiting.TrainingdayId } }),
        Enroll.create({ UserId: onWaiting.UserId, TrainingdayId: onWaiting.TrainingdayId }), User.findByPk(onWaiting.UserId)])
      if (getEnroll.lineUserId) { // 傳到私人 line 上
        pushMessage(lineUserId, `您報名的 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程，您已由備取轉為正取。`)
      }
    }
    return res.redirect('back')
  },
  cancelWaiting: async (req, res) => {   // 取消備取
    const [destroyWaiting, day, user] = await Promise.all([WaitingList.destroy({ where: { UserId: req.user.id, TrainingdayId: req.params.id } }),
    Trainingday.findByPk(req.params.id, { include: [Category], raw: true, nest: true }), User.findByPk(UserId)])
    if (user.lineUserId) { // 傳到私人 line 上
      pushMessage(lineUserId, `已取消報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    }
    req.flash('success_msg', `已取消報名 ${formatDate(day.date)} (${day.Category.day_CH}) ${formatTime(day.time)} 課程。`)
    return res.redirect('back')
  }
}

function pushMessage(userId, text) {
  client.pushMessage(userId, { type: 'text', text })
}


module.exports = enrollController
