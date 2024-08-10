const router = require("express").Router()

const product_controller = require('../controller/product_controller')


router.get('/', product_controller.getProduct);
router.post('/',product_controller.putProduct);
router.put('/',product_controller.putProduct);
router.delete('/',product_controller.delProduct);

module.exports = router