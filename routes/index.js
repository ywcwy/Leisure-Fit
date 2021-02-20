const express = require('express')
const router = express.Router()

const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')

router.get('/', leisurefitController.getLeisures)
router.get('/admin/leisurefit', adminController.getLeisures)


module.exports = router