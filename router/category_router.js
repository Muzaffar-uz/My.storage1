const router = require('express').Router()
const Category_counroller = require('../controller/category_controller')

router.get('/',Category_counroller.getCategoriy)
router.post('/',Category_counroller.postCategoriy);
router.put('/',Category_counroller.putCategory);
router.delete('/',Category_counroller.delCategoriy);



module.exports = router