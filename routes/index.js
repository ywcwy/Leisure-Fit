const express = require('express')
const router = express.Router()

const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

router.get('/', leisurefitController.getLeisures)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.logInPage)
router.post('/login', userController.logIn)
router.get('/admin/leisurefit', adminController.getLeisures)


module.exports = router