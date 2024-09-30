const router = require('express').Router()

const input_controller = require('../controller/input_controller')

router.get('/all/:id',input_controller.getInput)
router.post('/insert/:id',input_controller.postInput)
// router.put('/update/:id',input_controller.putInput)
router.delete('/delete/:id',input_controller.delInput);

module.exports = router