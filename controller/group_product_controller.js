
const Group_product = require('../models/group_product_models')

exports.getGroup_product = async (req,res)=>{
    const group_product = await Categoriy.query().where('*').first()
    return res.status(200).json({success: true, group_product:group_product})
}

exports.postGroup_product = async (req,res)=>{
     await Group_product.query().insert({
      name: req.body.name,
      categoriy_id: req.body.categoriy_id,
      namber_produc: req.body.namber_produc,  
    })
    return res.status(200).json({success:true, msg:"new Group_product insert"})
}

exports.putGroup_product = async (req,res)=>{
    const d = new Date()
    await Group_product.query().where('id',req.params.id).update({
        name: req.body.name,
      categoriy_id: req.body.categoriy_id,
      namber_produc: req.body.namber_produc,
       time: d,
    })
    return res.status(200).json({success:true,msg:'Group_product update'})
}

exports.delGroup_product = async (req,res)=>{
    await Group_product.query().where('id',params.id).delete()
    return res.status(200).json({success:true,msg:'delete Group_product'})
}