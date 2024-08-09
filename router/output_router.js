const router = require('express').Router()
const output_controller = require('../controller/output_contoller')

router.post('/',output_controller.postOutput)



module.exports = router