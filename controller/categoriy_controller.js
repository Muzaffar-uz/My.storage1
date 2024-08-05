const Categoriy = require('../models/categoriy_models')

exports.getCategoriy = async (req,res)=>{
    const categoriy = await Categoriy.query().where('*').first()
    return res.status(200).json({success: true, categoriy:categoriy})
}

exports.postCategoriy = async (req,res)=>{
     await Categoriy.query().insert({
      name: req.body.name,  
    })
    return res.status(200).json({success:true, msg:"new categoriy insert"})
}

exports.putCategory = async (req,res)=>{
    const d = new Date()
    await Categoriy.query().where('id',req.params.id).update({
       name: req.body.name ,
       time: d,
    })
    return res.status(200).json({success:true,msg:'categoriy update'})
}

exports.delCategoriy = async (req,res)=>{
    await Categoriy.query().where('id',params.id).delete()
    return res.status(200).json({success:true,msg:'delete categoriy'})
}