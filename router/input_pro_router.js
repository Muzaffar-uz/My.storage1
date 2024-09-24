const router = require('express').Router()

const Input_pro_controller = require('../controller/input_pro_controller')

router.get('/all',Input_pro_controller.getInput_pro)
router.get('/all1',Input_pro_controller.getCounterparty)
router.put('/update/:id',Input_pro_controller.putInput_pro)
router.delete('/delete/:id',Input_pro_controller.delInput_pro)
module.exports = router