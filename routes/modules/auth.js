const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/line', passport.authenticate('line'))

router.get('/line/return', passport.authenticate('line', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/'))



module.exports = router