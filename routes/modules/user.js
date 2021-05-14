const express = require('express')
const router = express.Router()
const likeController = require('../../controller/likeController')
const profileController = require('../../controller/profileController')
const enrollController = require('../../controller/enrollController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}

// 前台需登入頁面
// 收藏貼文
router.post('/like/:id', authenticated, likeController.addLike)
router.delete('/like/:id', authenticated, likeController.removeLike)

// profile
router.get('/profile', authenticated, profileController.getProfile)
router.get('/profile/edit', authenticated, profileController.getProfileEdit)
router.put('/profile', authenticated, profileController.editProfile)
router.get('/training', authenticated, profileController.getRecords)
router.get('/training/records/:id', authenticated, profileController.getRecord)
router.get('/likedLeisurefits', authenticated, profileController.getLikedLeisurefits)


// 報名課程
router.post('/training/enroll/:id', authenticated, enrollController.enrollCourse)
router.delete('/training/enroll/:id', authenticated, enrollController.cancelEnroll)
router.delete('/training/waiting/:id', authenticated, enrollController.cancelWaiting)


module.exports = router