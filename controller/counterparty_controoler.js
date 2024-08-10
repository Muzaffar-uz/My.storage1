const Counterparty = require('../models/counterparty_models')


exports.getCounertparty = async (req,res)=>{
   try{
    const counterparty = await Counterparty.query().select('*').first()
    if(!counterparty){
        return res.status(404).json({success:false, msg: "counterparty not found"})
    }
    return res.status(200).json({success:true, counterparty:counterparty})
}catch(err){
    return res.status(500).json({success:false, msg:"Server error",error: err.msg})
}
}

exports.postCounterparty = async (req,res)=>{
    try{
        await Counterparty.query().insert({
name: req.body.name,
first: req.body.name,
regions: req.body.regions,
address: req.body.addreess,
phone: req.body.phone,
inn: req.body.inn,
stir: req.body.stir,
mfo: req.body.mfo,
note: req.body.note,
email: req.body.email,

        })
        return res.status(200).json({success:true, msg:"yangi Klent qo'shildi"})
    }catch(err){
        return res.status(500).json({success:false, msg: "Server error" ,error: err.msg})
    }
}

exports.putCounterparty = async (req,res)=>{
   try{ 
 await Counterparty.query().where('id',req.params.id).update({
    name: req.body.name,
    first: req.body.name,
    regions: req.body.regions,
    address: req.body.addreess,
    phone: req.body.phone,
    inn: req.body.inn,
    stir: req.body.stir,
    mfo: req.body.mfo,
    note: req.body.note,
    email: req.body.email,
     
 })
 return res.status(200).json({success:true, msg:" Klent o'zgartirildi"})
}catch(err){
    return res.status(500).json({success:false, msg: "Server error" ,error: err.msg})
}
}

exports.delCounterparty = async (req,res) =>{
    try{
        await Counterparty.query().where('id',req.params.id).delete()

        return res.status(200).json({success:true, msg:" Klent o'chirldi"})
    }catch(err){
 return res.status(500).json({success:false, msg: "Server error" ,error: err.msg})
    }
}
