const db = require('../models')
const { Enroll, Trainingday, WaitingList } = db
const moment = require('moment')

const enrollController = {
  enroll: async (req, res) => {
    // 報名的課程日期
    const trainingDay = await Trainingday.findByPk(req.params.id, { raw: true })
    trainingDay.date = moment(trainingDay.date).format('YYYY-MM-DD')

    // 確認是否已報名過
    const alreadyEnroll = await Enroll.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } })
    if (alreadyEnroll) {
      return res.redirect('/user/training')
    }
    // 確認是否已在備取名單
    const alreadyOnWaitingList = await WaitingList.findOne({ where: { UserId: req.user.id, TrainingdayId: req.params.id } })
    if (alreadyOnWaitingList) {
      return res.redirect('/user/training')
    }

    // 目前正取人數
    const enrollCount = await Enroll.count({ where: { TrainingdayId: req.params.id } })
    // 目前備取人數
    const waitingCount = await WaitingList.count({ where: { TrainingdayId: req.params.id } })

    // 確認此堂課報名是否已額滿
    // 目前該堂正取人數尚未額滿
    if (enrollCount < 1) {
      await Enroll.create({ UserId: req.user.id, TrainingdayId: req.params.id }, { raw: true })
      req.flash('success_msg', `已成功${trainingDay.date}報名`)
      return res.redirect('/user/training')
    }

    // 目前該堂正取人數剛好額滿
    if (enrollCount === 1) {
      // 確認備取名單尚未額滿
      if (waitingCount < 1) {
        await WaitingList.create({ UserId: req.user.id, TrainingdayId: req.params.id }, { raw: true })
        req.flash('success_msg', `目前為備取${trainingDay.date}課程`)
        return res.redirect('/user/training')
      }
    }


    // 報名額滿，備取已額滿
    if (enrollCount >= 2 || waitingCount >= 1) {
      req.flash('error_msg', `${trainingDay.date}報名已額滿，目前為備取`)
      return res.redirect('/user/training')
    }

  }

}

module.exports = enrollController