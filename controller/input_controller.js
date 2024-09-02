 const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')


exports.getInput = async(req,res)=>{
    const input =await Input.query()
    .select('input_product.id', 
    'input_product.number',
    'input_product.price',
    'product.name AS product_name',
    'counterparty.name AS counterparty_name',
    'input_product.price_1',
    'input_product.price_2',
    'input_product.price_3',
    'input_product.price_4',
    'input_product.created',)
    
            .leftJoin('product', 'input_product.product_id', 'product.id')
            .leftJoin('counterparty', 'input_product.counterparty_id', 'counterparty.id')
            // .leftJoin('currency','input_product.currency_id','currency.id')
    return res.status(200).json({success:true, input:input})
}

 exports.postInput = async (req,res) =>{
    const price = [{price_1:req.body.price_1},]
     // Kiritish operatsiyasi
  await Input.query().insert({
    counterparty_id: req.body.counterparty_id,
    product_id: req.body.product_id,
    number: req.body.number,
    currency_id: req.body.currency_id,
    price:[{price_1:req.body.price_1},{price_2:req.body.price_2},{price_3:req.body.price_3},{price_3:req.body.price_3}]// Narxni qoshish
});
   
   
//  const d = new Date()
//     // product sonini sqalab qo'yish
//     const input = await Input.query().where('number', req.body.number).first()
//     const product = await Product.query().where('id', req.body.product_id).first()

//     await Product.query().where('id', req.body.product_id).update({
//         count: product.count + input.number,
        
//     })
//   //   savdo pulini klentga saqlab qo'yish
//     const counterparty =  await Counterparty.query().where('id',req.body.counterparty_id).first()
//     await Counterparty.query().where('id',req.body.counterparty_id).update({
// summ: counterparty.summ+(input.number*input.summ),
// updated:d,
//     })
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