const router = require("express").Router()

const product_controller = require('../controller/product_controller')


router.get('/all', product_controller.getProduct),

router.post('/',product_controller.putProduct)


module.exports = router