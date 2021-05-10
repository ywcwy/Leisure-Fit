const db = require('../models')
const { Enroll, Trainingday, WaitingList, Category } = db
const moment = require('moment')

const enrollController = {
  enrollCourse: async (req, res) => {
    const limitNumbers = 1 // 每堂課最多20人
    // 報名的課程日期
    const trainingDay = await Trainingday.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    trainingDay.date = moment(trainingDay.date).format('YYYY-MM-DD')
    trainingDay.time = moment(trainingDay.time, moment.HTML5_FMT.TIME).format("HH:mm")
    // // 確認是否已報名過
    // const alreadyEnroll = await Enroll.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } })
    // if (alreadyEnroll) {
    //   return res.redirect('/user/training')
    // }
    // // 確認是否已在備取名單
    // const alreadyOnWaitingList = await WaitingList.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } })
    // if (alreadyOnWaitingList) {
    //   return res.redirect('/user/training')
    // }

    // 目前正取人數
    const enrollCount = await Enroll.count({ where: { TrainingdayId: req.params.id } })
    // 目前備取人數
    const waitingCount = await WaitingList.count({ where: { TrainingdayId: req.params.id } })

    // 確認此堂課報名是否已額滿
    // 目前該堂正取人數尚未額滿
    if (enrollCount < limitNumbers) {
      await Enroll.create({ UserId: Number(req.user.id), TrainingdayId: Number(req.params.id) }, { raw: true })
      req.flash('success_msg', `已成功 ${trainingDay.date} (${trainingDay.Category.day_CH}) ${trainingDay.time} 報名`)
      return res.redirect('/user/training')
    }

    // 目前該堂正取人數剛好額滿
    if (enrollCount === limitNumbers) {
      // 確認備取名單尚未額滿
      if (waitingCount < limitNumbers) {
        await WaitingList.create({ UserId: Number(req.user.id), TrainingdayId: Number(req.params.id) }, { raw: true })
        req.flash('success_msg', `已備取 ${trainingDay.date} (${trainingDay.Category.day_CH}) ${trainingDay.time} 課程`)
        return res.redirect('/user/training')
      }
    }


    // 報名額滿，備取已額滿
    if (enrollCount >= limitNumbers && waitingCount >= limitNumbers) {
      req.flash('warning_msg', `${trainingDay.date} (${trainingDay.Category.day_CH}) ${trainingDay.time} 報名已額滿`)
      return res.redirect('/user/training')
    }

  },
  cancelEnroll: async (req, res) => {
    // 取消正取
    await Enroll.destroy({ where: { UserId: Number(req.user.id), TrainingdayId: Number(req.params.id) } })
    const cancel = await Trainingday.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    cancel.date = moment(cancel.date).format('YYYY-MM-DD')
    cancel.time = moment(cancel.time, moment.HTML5_FMT.TIME).format("HH:mm")

    // 如果目前有備取名單
    // 目前備取第一位要改為正取
    const onWaiting = await WaitingList.findOne({ where: { TrainingdayId: Number(req.params.id) }, order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday] })
    if (onWaiting) {
      const { UserId, TrainingdayId } = onWaiting
      await WaitingList.destroy({ where: { UserId, TrainingdayId } })
      await Enroll.create({ UserId, TrainingdayId })
    }

    req.flash('success_msg', `已取消報名 ${cancel.date} (${cancel.Category.day_CH}) ${cancel.time} 課程`)
    return res.redirect('/user/training')
  },
  cancelWaiting: async (req, res) => {
    // 取消備取
    await WaitingList.destroy({ where: { UserId: Number(req.user.id), TrainingdayId: Number(req.params.id) } })
    const cancel = await Trainingday.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    cancel.date = moment(cancel.date).format('YYYY-MM-DD')
    cancel.time = moment(cancel.time, moment.HTML5_FMT.TIME).format("HH:mm")
    req.flash('success_msg', `已取消報名 ${cancel.date} (${cancel.Category.day_CH}) ${cancel.time} 課程`)
    return res.redirect('/user/training')
  }

}

module.exports = enrollController