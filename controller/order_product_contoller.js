
const Order_product = require('../models/order_product_models')


exports.getOutput = async (req,res)=>{
  const output = await Order_product.query().select('*').first()
    return res.status(200).json({success:true, output: output})
}

 exports.postOutput = async (req,res) =>{
    await Output.query().insert({
        counterparty_id: req.body.counterparty_id,
        product_id: req.body.product_id,
        number: req.body.number,
        currency_id: req.body.currency_id,
        price: req.body.price,
        //  bu yerda vaqt o'zgatirish
        created: req.body.created
    })
    const d = new Date()
    const output = await Output.query().where('number', req.body.number).first()
    const product = await Product.query().where('id', req.body.product_id).first()
// maxsulot sonidan olish
    await Product.query().where('id', req.body.product_id).update({
        count: product.count - output.number,
        updated: d,
    })
// klentdan  summani olish
    const counterparty =  await Counterparty.query().where('id',req.body.counterparty_id).first()
    await Counterparty.query().where('id',req.body.counterparty_id).update({
summ: counterparty.summ-(input.number*input.summ),
updated:d,
    })
    return res.status(200).json({success:true, msg: ' maxsulot jo\'natildi'})
 }

 exports.putOutput = async (req,res)=>{
    await Output.query().where("id",req.params.id).update({
        counterparty_id: req.body.counterparty_id,
        product_id: req.body.product_id,
        number: req.body.number,
        currency_id: req.body.currency_id,
        price: req.body.price,
        //  bu yerda vaqt o'zgatirish
        created: req.body.created
    })
    return res.status(200).json({success:true, msg: ' Jo\'natma o\'zgartirldi'})
 }

 exports.delOutput = async (req,res) => {
await Output.query().where('id'.req.params.id).delete()
return res.status(200).json({ success: true, msg: "delete Output" })
 }


 