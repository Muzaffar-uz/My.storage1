 const Input = require('../models/input_models')
const Input_pro = require('../models/input_pro_models')




exports.getInput = async (req, res) => {
    try {
        const input = await Input.query()
            .select(
            "input_product.id", 
            "input_product.product_id",
            "product.name as product",
            "input_product.provider_id",
            "input_product.number",
            "input_product.price",
            "input_product.currency_id", 
            "currency.name as currency",
            "input_product.created")
            .where('provider_id', req.params.id)
            .leftJoin('currency', 'input_product.currency_id', 'currency.id')
            .leftJoin('product','input_product.product_id','product.id');

        return res.status(200).json({ success: true, input });
    } catch (error) {
        return res.status(500).json({ success: false, message:error });
    }
};




exports.postInput = async (req, res) => {
  try {
    // Kiritish operatsiyasi
    await Input.query().insert({
      provider_id: req.params.id,
      product_id: req.body.product_id,
      number: req.body.number,
      currency_id: req.body.currency_id,
      price: req.body.price,
      created: req.body.created
    });

    // Bu yerda provider_id orqali qidiryapmiz
    const input_pro = await Input_pro.query().where('id', req.params.id).first();
    
    // Agar input_pro topilmasa
    if (!input_pro) {
      return res.status(404).json({ success: false, msg: 'Input topilmadi' });
    }

    if (req.body.currency_id ==1) {
      // 1=$$
      await Input_pro.query().where('id', req.params.id).update({
        count: Number(input_pro.count) + Number(req.body.number), 
        summ$:(Number(input_pro['summ$']) ) + Number(req.body.price) 
      });
      return res.status(200).json({ success: true, msg: 'Yangi mahsulot qo\'shildi' });
    }

    if (req.body.currency_id ==2) {
      // 2=so'm
      await Input_pro.query().where('id', req.params.id).update({
        count: Number(input_pro.count) + Number(req.body.number), 
        summ: Number(input_pro.summ ) + Number(req.body.price) 
      });
      return res.status(200).json({ success: true, msg: 'Yangi mahsulot qo\'shildi' });
    }
    return res.status(400).json({ success: false, msg: 'Valyuta identifikatori noto\'g\'ri' }); // Agar currency_id 1 yoki 2 bo'lmasa
  } catch (e) {
    // Xato xabarini yaxshiroq ko'rsatamiz
    return res.status(500).json({ success: false, msg: e.message });
  }
};

  

// exports.putInput = async (req, res) => {
//   try {
//     // O'chirishdan oldin Inputdan o'chirilayotgan yozuvni topamiz
//     const inputToDelete = await Input.query().where('id', req.params.id).first();

//     // Agar Inputda ma'lumot topilmasa
//     if (!inputToDelete) {
//       return res.status(404).json({ success: false, msg: 'Input topilmadi' });
//     }

//     // `Input_pro` jadvalidagi `counterparty_id` orqali bog'langan yozuvni topamiz
//     const input_pro = await Input_pro.query()
//       .where('id', inputToDelete.provider_id)
//       .first();

//     // Agar Input_pro jadvalidagi ma'lumot topilmasa
//     if (!input_pro) {
//       return res.status(404).json({ success: false, msg: 'Input_pro topilmadi' });
//     }

//     // `Input_pro` dagi countdan `Input` dagi numberni ayirib yangilaymiz
//     await Input_pro.query().where('id', inputToDelete.provider_id).update({
//       count: Number(input_pro.count) - Number(inputToDelete.number)
//     });

//     // Inputdan ma'lumotni o'chiramiz
//     await Input.query().where('id', req.params.id).update({
//       number:req.body.number,
//       created:req.body.created
//     });
//     await Input_pro.query().where('id', inputToDelete.provider_id).update({
//       count: Number(input_pro.count) + Number(req.body.number)
//     });

//     return res.status(200).json({ success: true, msg: 'Mahsulot yangilandi va count yangilandi' });
//   } catch (e) {
//     return res.status(500).json({ success: false, msg: e.message });
//   }
// };


 exports.delInput = async (req, res) => {
  try {
    // O'chirishdan oldin Inputdan o'chirilayotgan yozuvni topamiz
    const inputToDelete = await Input.query().where('id', req.params.id).first();

    // Agar Inputda ma'lumot topilmasa
    if (!inputToDelete) {
      return res.status(404).json({ success: false, msg: 'Input topilmadi' });
    }

    // `Input_pro` jadvalidagi `counterparty_id` orqali bog'langan yozuvni topamiz
    const input_pro = await Input_pro.query()
      .where('id', inputToDelete.provider_id)
      .first();

    // Agar Input_pro jadvalidagi ma'lumot topilmasa
    if (!input_pro) {
      return res.status(404).json({ success: false, msg: 'Input_pro topilmadi' });
    }
if(inputToDelete.currency_id == 1){
    // `Input_pro` dagi countdan `Input` dagi numberni ayirib yangilaymiz
    await Input_pro.query().where('id', inputToDelete.provider_id).update({
      count: Number(input_pro.count) - Number(inputToDelete.number),
      summ$: Number(input_pro['summ$']) - Number(inputToDelete.price)
    });
  }
  if(inputToDelete.currency_id == 2){
    // `Input_pro` dagi countdan `Input` dagi numberni ayirib yangilaymiz
    await Input_pro.query().where('id', inputToDelete.provider_id).update({
      count: Number(input_pro.count) - Number(inputToDelete.number),
      summ: Number(input_pro.summ) - Number(inputToDelete.price)
    });
  }
    // Inputdan ma'lumotni o'chiramiz
    await Input.query().where('id', req.params.id).delete();

    return res.status(200).json({ success: true, msg: 'Mahsulot o\'chirildi va count yangilandi' });
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
};



  