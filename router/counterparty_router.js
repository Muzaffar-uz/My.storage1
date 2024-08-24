const router = require('express').Router()
const Counterparty_counroller = require('../controller/counterparty_controoler')

router.get('/all',Counterparty_counroller.getCounertparty)
router.post('/insert',Counterparty_counroller.postCounterparty);
router.put('/updated/:id',Counterparty_counroller.putCounterparty);
router.delete('/delete/:id',Counterparty_counroller.delCounterparty)



module.exports = router
