 const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')
const input_provider = require('../models/input_pro_models')
const XLSX = require('xlsx');



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
        "input_product.created"
      )
      .where('provider_id', req.params.id)
      .whereNot('input_product.status', 4) // Status 4 bo'lgan qiymatlarni ko‘rsatmaydi
      .leftJoin('currency', 'input_product.currency_id', 'currency.id')
      .leftJoin('product', 'input_product.product_id', 'product.id');

    return res.status(200).json({ success: true, input });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};


exports.getProduct = async (req, res) => {
  const { name } = req.query;

  const knex = await Product.knex();

  // Agar name parametri berilmagan bo'lsa, status 0 bo'lmagan barcha mahsulotlarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM product WHERE status != 0
    `);
    return res.json({ success: true, input: data[0] });
  }

  // name parametriga ko'ra qidirish, status 0 bo'lmagan mahsulotlar
  const data = await knex.raw(`
    SELECT id, name FROM product WHERE name LIKE ? AND status != 0
  `, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
};




exports.postInput = async (req, res) => {
  try {
    const status = parseInt(req.body.status);
    const provider_id = req.params.id;
   

    if (status === 1) {
      // kirgizsh tavarni
      const lastAdded = await Input.query().where('product_id', req.body.product_id).orderBy('id','desc').first();
      const lastAddedNumber = lastAdded ? lastAdded.total : 0; // Oxirgi qo'shilgan qiymat yoki 0
    // Yangi totalni hisoblas 
      const newTotal = parseInt(lastAddedNumber) + parseInt(req.body.number);


  // Oxirgi balansni olish va uni tekshirish
  const lastbalance = await Input.query().where('provider_id', provider_id).orderBy('id', 'desc').first();
// `lastbalance.balance` null bo‘lsa, 0 qiymatini qo‘yish
const lastbalanceCount = lastbalance && lastbalance.balance != null ? parseInt(lastbalance.balance) : 0;
// `price` ni raqamga o‘zgartirish va `NaN`ga tekshirish
const price = parseInt(req.body.price);
if (isNaN(price)) {return res.status(400).json({success: false,message: 'Noto\'g\'ri `price` qiymati',
  });
}
// Yangi balansni hisoblash
const newBalance = lastbalanceCount + price;
  // Agar `newBalance` NaN bo‘lsa, uni 0 qilib qo‘yish
  const finalBalance = isNaN(newBalance) ? 0 : newBalance;
 
const customer  =  await input_provider.query().where('id', provider_id).first()
if(!customer){
  return res.status(404).json({ success: false, msg: 'customer not here' })
}
const counterparty_id = customer ? customer.counterparty_id : 0

      await Input.query().insert({
          provider_id: provider_id,
          counterparty_id : counterparty_id,
          status: status,
          product_id: req.body.product_id,
          number: Number(req.body.number),
          currency_id: req.body.currency_id,
          price: req.body.price,
          total: newTotal,
          balance: finalBalance,
          created: req.body.created, });


              // Retrieve and update product count
      const product = await Product.query().where('id', req.body.product_id).first();
      if (product) {
        const currentCount = parseInt(product.count) || 0; // Ensure count is an integer
        await Product.query().where('id', req.body.product_id).update({
          count: currentCount + parseInt(req.body.number),
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // counterparty_id mavjudligini tekshirish

// counterparty_id va provider_id ga mos yozuvni olish
const counterparty = await Counterparty.query().where('id', counterparty_id).first();

if (counterparty) {
  const currentbalance = parseInt(counterparty.balance) || 0;
  await Counterparty.query().where('id', counterparty_id).update({
      balance: currentbalance + parseInt(req.body.price),
    });
   }
return res.status(200).json({
          success: true,
          message: 'Data inserted and total updated successfully',
          total: newTotal,
        });
     }
      
      if(status === 2){
        // sotish chiqishi
        const lastAdded = await Input.query().where('product_id', req.body.product_id).orderBy('id','desc').first();
      
      const lastAddedNumber = lastAdded ? lastAdded.total : 0; // Oxirgi qo'shilgan qiymat yoki 0
      
      // 3. Yangi totalni hisoblash
      const newTotal = parseInt(lastAddedNumber) - parseInt(req.body.number);
    
      await Input.query().insert({
          provider_id: provider_id,
          status: status,
          product_id: req.body.product_id,
          number: Number(req.body.number),
          currency_id: req.body.currency_id,
          price: req.body.price,
          total: newTotal,
          created: req.body.created, });


              // Retrieve and update product count
      const product = await Product.query().where('id', req.body.product_id).first();
      if (product) {
        const currentCount = parseInt(product.count) || 0; // Ensure count is an integer
        await Product.query().where('id', req.body.product_id).update({
          count: currentCount - parseInt(req.body.number),
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

        return res.status(200).json({
          success: true,
          message: 'Data inserted and total updated successfully',
          total: newTotal,
        });
      }
      if(status === 3){
        // qaytarib olish
        const lastAdded = await Input.query().where('product_id', req.body.product_id).orderBy('id','desc').first();
      
      const lastAddedNumber = lastAdded ? lastAdded.total : 0; // Oxirgi qo'shilgan qiymat yoki 0
      
      // 3. Yangi totalni hisoblash
      const newTotal = parseInt(lastAddedNumber) + parseInt(req.body.number);
    
      await Input.query().insert({
          provider_id: provider_id,
          status: status,
          product_id: req.body.product_id,
          number: Number(req.body.number),
          currency_id: req.body.currency_id,
          price: req.body.price,
          total: newTotal,
          created: req.body.created, });


              // Retrieve and update product count
      const product = await Product.query().where('id', req.body.product_id).first();
      if (product) {
        const currentCount = parseInt(product.count) || 0; // Ensure count is an integer
        await Product.query().where('id', req.body.product_id).update({
          count: currentCount + parseInt(req.body.number),
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

        return res.status(200).json({
          success: true,
          message: 'Data inserted and total updated successfully',
          total: newTotal,
        });
      }
      if(status === 4){
        // o'chrish
        const lastAdded = await Input.query().where('product_id', req.body.product_id).orderBy('id','desc').first();
      
        const lastAddedNumber = lastAdded ? lastAdded.total : 0; // Oxirgi qo'shilgan qiymat yoki 0
        
        // 3. Yangi totalni hisoblash
        const newTotal = parseInt(lastAddedNumber) - parseInt(req.body.number);
      
        await Input.query().insert({
            provider_id: provider_id,
            status: status,
            product_id: req.body.product_id,
            number: Number(req.body.number),
            currency_id: req.body.currency_id,
            price: req.body.price,
            total: newTotal,
            created: req.body.created, });
  
  
                // Retrieve and update product count
        const product = await Product.query().where('id', req.body.product_id).first();
        if (product) {
          const currentCount = parseInt(product.count) || 0; // Ensure count is an integer
          await Product.query().where('id', req.body.product_id).update({
            count: currentCount - parseInt(req.body.number),
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Product not found',
          });
        }
  
          return res.status(200).json({
            success: true,
            message: 'Data inserted and total updated successfully',
            total: newTotal,
          });
        }
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
}




exports.putInput = async (req, res) => {
  try{await Input.query().findOne('id', req.params.id).update(req.body)
    return res.status(200).json({success:true})
  }catch(e){
        res.status(500).json({ error: e});
      }
}

 exports.delInput = async (req, res) => {
  try{ await Input.query().where('id',req.params.id).delete()
  return res.status(200).json({success:true})}catch(e){
      res.status(500).json({ error: e});
  }
}

exports.exportInputToExcel = async (req, res) => {

  const providerId = req.params.id;
  const knex = await Input.knex();
  try {
    const result = await knex.raw(`
    SELECT d.name, a.name AS product, n.number, 
           CASE 
             WHEN p.name = 'mlliy valyuta' THEN n.price 
             ELSE NULL 
           END AS price_milliy,
           CASE 
             WHEN p.name != 'mlliy valyuta' THEN n.price 
             ELSE NULL 
           END AS price_$$,
           q.created
    FROM input_product AS n
    LEFT JOIN product AS a ON a.id = n.product_id
    LEFT JOIN currency AS p ON p.id = n.currency_id 
    LEFT JOIN input_provider AS q ON q.id = n.provider_id
    LEFT JOIN counterparty AS d ON d.id = q.counterparty_id
    WHERE n.provider_id = ?
    `, [providerId]);

    const products = result[0];
    if (products.length === 0) {
        return res.status(404).json({ success: false, message: "Ma'lumot topilmadi" });
    }

    // Excel faylini yaratish
    const worksheet = XLSX.utils.json_to_sheet(products);

    // Jami hisoblash
    const totalNumber = products.reduce((sum, product) => sum + (product.number || 0), 0);
    const totalPrice = products.reduce((sum, product) => sum + (product.price_$$ || 0), 0);
    const totalPriceMilliy = products.reduce((sum, product) => sum + (product.price_milliy || 0), 0);

    // Jami qatorini qo'shish
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["", "", totalNumber, totalPrice, totalPriceMilliy]
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mahsulotlar");

    // Faylni bufferga yozish
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Faylni yuborish
    res.setHeader('Content-Disposition', `attachment; filename=mahsulotlar.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Xatolik yuz berdi" });
  }
}


  