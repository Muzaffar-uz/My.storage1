
const Group_product = require('../models/group_product_models')

exports.getGroup_product = async (req,res)=>{
    const group_product = await Group_product.query()
    .select('group_product.id',
    'group_product.name',
    'category.name AS category_name',
    'categoriy_id',
    'group_product.created')
    .leftJoin('category','group_product.categoriy_id','category.id').where('categoriy_id',req.params.id)
    return res.status(200).json({success: true, group_product:group_product})
}

exports.postGroup_product = async (req,res)=>{
    console.log
     await Group_product.query().insert({
      name: req.body.name,
      categoriy_id: req.body.categoriy_id,
       
    })
    
    return res.status(200).json({success:true, msg:"new Group_product insert"})
}

exports.putGroup_product = async (req,res)=>{
    // const d = new Date()
    await Group_product.query().where('id',req.params.id).update({
        name: req.body.name,
      categoriy_id: req.body.categoriy_id,
      
    //    time: d,
    })
    return res.status(200).json({success:true,msg:'Group_product update'})
}

exports.delGroup_product = async (req,res)=>{
    await Group_product.query().where('id',req.params.id).delete()
    return res.status(200).json({success:true,msg:'delete Group_product'})
}