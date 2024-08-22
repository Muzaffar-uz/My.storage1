const router = require("express").Router()

const product_controller = require('../controller/product_controller')


router.get('/all', product_controller.getProduct);
router.post('/insert',product_controller.postProduct);
router.put('/update/:id',product_controller.putProduct);
router.delete('/',product_controller.delProduct);

module.exports = router