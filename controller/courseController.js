const db = require('../models')
const { Category, Trainingday, Exercise, Equipment, Training, Workout, Enroll, WaitingList, User } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')
const { pushMessage } = require('../config/lineBot')
const { Op } = require("sequelize")

const courseController = {

  // 課程日
  getTrainingDays: async (req, res) => {
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
    let trainingday = {}
    if (req.params.id) {
      trainingday = await Trainingday.findByPk(req.params.id, { raw: true })
      trainingday.date = formatDate(trainingday.date)
      trainingday.time = formatTime(trainingday.time)
    }
    return res.render('admin/courses', { trainingdays, categories, trainingday })
  },
  postTrainingDay: async (req, res) => {
    const { date, categoryId, time, limitNumber } = req.body
    await Trainingday.create({ date, CategoryId: Number(categoryId), time, limitNumber })
    req.flash('success_msg', '新增成功。')
    return res.redirect('back')
  },
  putTrainingDay: async (req, res) => {
    const { date, categoryId, time, limitNumber } = req.body
    await Trainingday.update({ date, CategoryId: Number(categoryId), time, limitNumber }, { where: { id: req.params.id } })
    req.flash('success_msg', '修改成功。')
    return res.redirect('/admin/courses/trainingdays')
  },
  deleteTrainingDay: async (req, res) => {
    await Trainingday.destroy({ where: { id: req.params.id } })
    req.flash('success_msg', '刪除成功。')
    return res.redirect('back')
  },

  // 開放/截止報名日期
  handleEnrollment: async (req, res) => {
    const trainingDay = await Trainingday.findByPk(req.params.id, { include: [Category] })
    const [open, users] = await Promise.all([trainingDay.update({ enroll: !trainingDay.enroll }), User.findAll({ where: { lineUserId: { [Op.ne]: null } }, attributes: ['lineUserId'], raw: true, nest: true })])
    console.log(users)
    pushMessage(users, `課程已開放 ${formatDate(trainingDay.date)}（${formatTime(trainingDay.Category.day_CH)}）${formatTime(trainingDay.time)}報名。`)
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
    await Enroll.destroy({ where: { TrainingdayId: trainingdayId, UserId: userId } })
    req.flash('success_msg', `已取消 ${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程。`)

    if (enroll.User.lineUserId) { // 傳到私人 line 上
      pushMessage(user.lineUserId, `已取消 ${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程。`)
    }
    // 如果目前有備取名單，備取第一位要改為正取
    const onWaiting = await WaitingList.findOne({
      where: { TrainingdayId: trainingdayId },
      order: [['createdAt', 'ASC']], limit: 1, include: [Trainingday]
    })
    if (onWaiting) {
      const { UserId, TrainingdayId } = onWaiting
      WaitingList.destroy({ where: { UserId, TrainingdayId } })
      const toEnroll = await Enroll.create({ UserId, TrainingdayId }, { include: [User] })
      if (toEnroll.lineUserId) {
        pushMessage(getEnroll.lineUserId, `${enroll.User.name} 報名的 ${formatDate(enroll.Trainingday.date)} (${enroll.Trainingday.Category.day_CH}) ${formatTime(enroll.Trainingday.time)} 課程已由備取轉為正取。`)
      }
    }

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
  },

  // 動作項目
  getExercises: async (req, res) => {
    const exercises = await Exercise.findAll({ raw: true })
    let exercise = {}
    if (req.params.id) { exercise = await Exercise.findByPk(req.params.id, { raw: true }) }
    return res.render('admin/courses', { exercises, exercise })
  },
  postExercise: async (req, res) => {
    const { move, description } = req.body
    await Exercise.create({ move, description })
    req.flash('success_msg', '動作項目新增成功。')
    return res.redirect('back')
  },
  putExercise: async (req, res) => {
    const { move, description } = req.body
    await Exercise.update({ move, description }, { where: { id: req.params.id } })
    req.flash('success_msg', '動作項目修改成功。')
    return res.redirect('/admin/courses/exercises')
  },
  deleteExercise: async (req, res) => {
    await Exercise.destroy({ where: { id: req.params.id } })
    req.flash('success_msg', '動作項目刪除成功。')
    return res.redirect('back')
  },

  // 器材項目
  getEquipments: async (req, res) => {
    const equipments = await Equipment.findAll({ raw: true })
    let equipment = {}
    if (req.params.id) { equipment = await Equipment.findByPk(req.params.id, { raw: true }) }
    return res.render('admin/courses', { equipments, equipment })
  },
  postEquipment: async (req, res) => {
    const { item, description } = req.body
    await Equipment.create({ item, description })
    req.flash('success_msg', '器材新增成功。')
    return res.redirect('back')
  },
  putEquipment: async (req, res) => {
    const { item, description } = req.body
    await Equipment.update({ item, description }, { where: { id: req.params.id } })
    req.flash('success_msg', '器材更新成功。')
    return res.redirect('/admin/courses/equipments')
  },
  deleteEquipment: async (req, res) => {
    await Equipment.destroy({ where: { id: req.params.id } })
    req.flash('success_msg', '器材刪除成功。')
    return res.redirect('back')
  },

  // 訓練日的菜單
  getWorkouts: async (req, res) => {
    const trainingdays = await Trainingday.findAll({ raw: true })
    let trainings = await Promise.all(trainingdays.map(async (t) => {
      const workouts = await Workout.findAll({ //找每個訓練日的 workout 項目
        where: { TrainingdayId: t.id }, attributes: ['id', 'repetitions', 'sets'], raw: true, nest: true,
        include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
      })
      const date = formatDate(t.date) // 訓練日
      const workout = workouts.map(w => {
        return {
          id: w.id,
          repetitions: w.repetitions,
          sets: w.sets,
          exercise: w.Training.Exercise.move,
          exerciseDescription: w.Training.Exercise.description,
          equipment: w.Training.Equipment.item,
          equipmentDescription: w.Training.Equipment.description
        }
      })
      return { date, workout }
    }))
    return res.render('admin/courses', { trainings })
  },
  createWorkout: async (req, res) => {
    let [exercises, equipments, trainingdays] = await Promise.all([
      Exercise.findAll({ raw: true }), Equipment.findAll({ raw: true }), Trainingday.findAll({ raw: true })])
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: formatDate(t.date)
      }
    })
    let workout = {}
    if (req.params.id) {
      const event = await Workout.findOne({ where: { id: req.params.id }, raw: true })
      const [trainingday, training] = await Promise.all([
        Trainingday.findByPk(event.TrainingdayId, { raw: true }), Training.findByPk(event.TrainingId, { raw: true })])
      workout = {
        id: req.params.id,
        date: formatDate(trainingday.date),
        categoryId: trainingday.CategoryId,
        time: formatTime(trainingday.time),
        exerciseId: training.ExerciseId,
        equipmentId: training.EquipmentId,
        repetitions: event.repetitions,
        sets: event.sets
      }
    }
    return res.render('admin/workoutCreate', { workout, trainingdays, exercises, equipments })
  },
  postWorkout: async (req, res) => {
    const { trainingdayId, exerciseId, equipmentId, repetitions, sets } = req.body
    const training = await Training.create({ ExerciseId: Number(exerciseId), Equipment: Number(equipmentId) })
    await Workout.create({ TrainingdayId: Number(trainingdayId), TrainingId: Number(training.id), repetitions, sets })
    req.flash('success_msg', '訓練項目新增成功。')
    return res.redirect('back')
  },
  putWorkout: async (req, res) => {
    const { exerciseId, equipmentId, repetitions, sets } = req.body
    const workout = await Workout.findByPk(req.params.id, { raw: true })
    Training.update({ ExerciseId: Number(exerciseId), EquipmentId: Number(equipmentId) }, { where: { id: workout.TrainingId } })
    await Workout.update({ repetitions, sets }, { where: { id: req.params.id } })
    req.flash('success_msg', '訓練項目更新成功。')
    return res.redirect('/admin/courses/workouts')
  },
  deleteWorkout: async (req, res) => {
    await Workout.destroy({ where: { id: req.params.id } })
    req.flash('success_msg', '訓練項目刪除成功。')
    return res.redirect('back')
  }
}



module.exports = courseController