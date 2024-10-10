const router = require('express').Router()

const Input_pro_controller = require('../controller/input_pro_controller')

router.get('/all',Input_pro_controller.getInput_pro)
router.get('/all1',Input_pro_controller.getCounterparty)
router.post('/insert',Input_pro_controller.postInput_pro)
router.put('/update/:id',Input_pro_controller.putInput_pro)
router.delete('/delete/:id',Input_pro_controller.delInput_pro)
router.get('/time',Input_pro_controller.getInput_proTime)
router.get('/search',Input_pro_controller.getInput_proSearch)
module.exports = router