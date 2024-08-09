const router = require('express').Router()

const input_controller = require('../controller/input_controller')


router.post('/',input_controller.postInput)

module.exports = router