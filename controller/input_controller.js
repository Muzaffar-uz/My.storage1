 const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')


exports.getInput = async(req,res)=>{
    const input = Input.query().select('*').first()
    return res.status(200).json({success:true, input:input})
}

 exports.postInput = async (req,res) =>{
    await Input.query().insert({
        counterparty_id: req.body.counterparty_id,
        product_id: req.body.product_id,
        number: req.body.number,
        currency_id: req.body.currency_id,
        price: req.body.price,
    })
    const d = new Date()
    // product sonini sqalab qo'yish
    const input = await Input.query().where('number', req.body.number).first()
    const product = await Product.query().where('id', req.body.product_id).first()

    await Product.query().where('id', req.body.product_id).update({
        count: product.count + input.number,
        
    })
  //   savdo pulini klentga saqlab qo'yish
    const counterparty =  await Counterparty.query().where('id',req.body.counterparty_id).first()
    await Counterparty.query().where('id',req.body.counterparty_id).update({
summ: counterparty.summ+(input.number*input.summ),
updated:d,
    })
    return res.status(200).json({success:true, msg: 'Ynagi maxsulot qo\'shildi'})
 }

 exports.putInput = async (req,res) =>{
        await Input.query().where('id',req.parms.id).update({
            counterparty_id: req.body.counterparty_id,
            product_id: req.body.product_id,
            number: req.body.number,
            currency_id: req.body.currency_id,
            price: req.body.price,
            //  bu yerda vaqtni o'zgartirsh
        created: req.body.created,
    })
    return res.status(200).json({success:true, msg: ' maxsulot o\'zgartirildi'})
 }

 exports.delInput = async (req,res) =>{
    await Input.query().where('id',req.parms.id).delete()
return res.status(200).json({success:true, msg: ' maxsulot o\'chirildi'})
}