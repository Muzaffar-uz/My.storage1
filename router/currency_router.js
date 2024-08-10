const router = require('express').Router()

const currency_controller = require('../controller/currency_controller')

router.get('/',currency_controller.getCurrency)
router.post('/',currency_controller.postCurrency)
router.put('/',currency_controller.putCurrency)
router.delete('/',currency_controller.delCurrency)

module.exports = router