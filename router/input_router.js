const router = require('express').Router()

const input_controller = require('../controller/input_controller')

router.get('/',input_controller.getInput)
router.post('/',input_controller.postInput)
router.put('/',input_controller.putInput);
router.delete('/',input_controller.delInput);

module.exports = router