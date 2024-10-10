 const Input = require('../models/input_models')
const Product = require('../models/product_models')
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
            "input_product.created")
            .where('provider_id', req.params.id)
            .leftJoin('currency', 'input_product.currency_id', 'currency.id')
            .leftJoin('product','input_product.product_id','product.id');

        return res.status(200).json({ success: true, input });
    } catch (error) {
        return res.status(500).json({ success: false, message:error });
    }
};

exports.getProduct = async (req, res) => {
  const { name } = req.query;

  const knex = await Product.knex();

  // Agar name parametri berilmagan bo'lsa, barcha counterpartylarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM product
    `);
    return res.json({ success: true, input: data[0] });
  }

  const data = await knex.raw(`
    SELECT id, name FROM product WHERE name LIKE ?`, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
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

  } catch (e) {
    // Xato xabarini yaxshiroq ko'rsatamiz
    return res.status(500).json({ success: false, msg: e.message });
  }
};

  

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


  