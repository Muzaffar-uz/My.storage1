const router = require('express').Router()
const Counterparty_counroller = require('../controller/counterparty_controoler')

router.get('/',Counterparty_counroller.getCounertparty)
router.post('/',Counterparty_counroller.postCounterparty);
router.put('/',Counterparty_counroller.putCounterparty);
router.delete('/',Counterparty_counroller.delCounterparty)



module.exports = router
