const router = require("express").Router()

const product_controller = require('../controller/product_controller')


router.post('/',product_controller.putProduct)


module.exports = router