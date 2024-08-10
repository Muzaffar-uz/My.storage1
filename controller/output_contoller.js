const Output = require('../models/output_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')

 exports.postOutput = async (req,res) =>{
    await Output.query().insert({
        counterparty_id: req.body.counterparty_id,
        product_id: req.body.product_id,
        number: req.body.number,
        value_id: req.body.value_id,
        summ: req.body.summ,
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