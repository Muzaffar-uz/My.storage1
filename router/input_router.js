const router = require('express').Router()

const input_controller = require('../controller/input_controller')

router.get('/all',input_controller.getInput)
router.post('/insert',input_controller.postInput)
router.post('/updated/:id',input_controller.putInput);
router.delete('/delete/:id',input_controller.delInput);
router.get('/all2',input_controller.getInput2)
module.exports = router