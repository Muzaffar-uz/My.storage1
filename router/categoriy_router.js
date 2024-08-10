const router = require('express').Router()
const Categoriy_counroller = require('../controller/categoriy_controller')

router.get('/',Categoriy_counroller.getCategoriy)
router.post('/',Categoriy_counroller.postCategoriy);
router.put('/',Categoriy_counroller.putCategory);
router.delete('/',Categoriy_counroller.delCategoriy);



module.exports = router