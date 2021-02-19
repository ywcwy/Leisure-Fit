const express = require('express')
const router = express.Router()

const leisurefitController = require('../controller/leisurefitController')
router.get('/', leisurefitController.getLeisure)


module.exports = router