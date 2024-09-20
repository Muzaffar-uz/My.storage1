const router = require('express').Router()

const Input_pro_controller = require('../controller/input_pro_controller')

router.get('/all',Input_pro_controller.getInput_pro)

module.exports = router