const router = require('express').Router()
const Category_counroller = require('../controller/category_controller')

router.get('/all',Category_counroller.getCategoriy)
router.post('/insert',Category_counroller.postCategoriy);
router.post('/update/:id',Category_counroller.putCategory);
router.delete('/delete/:id',Category_counroller.delCategoriy);



module.exports = router