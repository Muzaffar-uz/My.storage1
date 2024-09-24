 const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')




exports.getInput = async (req, res) => {
  
    const input = await Input.query().select("*").where('provider_id', req.params.id).leftJoin('')
  
    
    return res.status(200).json({ success: true, input: input });
  };




 exports.postInput = async (req,res) =>{
    const price = [{price_1:req.body.price_1},]
     // Kiritish operatsiyasi
  await Input.query().insert({
    counterparty_id: req.body.counterparty_id,
    product_id: req.body.product_id,
    number: req.body.number,
    currency_id: req.body.currency_id,
    price :req.body.price,
    created: req.body.created
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



exports.getInput2 = async (req, res) => {
    const knex = await Input.knex(); 
  
    const data = await knex.raw(`
    SELECT n.id, 
    a.id as id_counterparty, 
    a.name as counterparty, 
    k.id as id_product, 
    k.name as product, 
    n.number as namber, 
    n.price as price, 
    k.price_1,
    k.price_2,
    k.price_3,
    d.id as currency_id, 
    d.name as currency, 
    n.created as created
    FROM input_product as n  
    LEFT JOIN counterparty as a on a.id = n.counterparty_id
    LEFT JOIN product as k on k.id = n.product_id
    LEFT JOIN currency as d on d.id = n.currency_id`);
  
    return res.json({ success: true, input: data[0] });
  };
  