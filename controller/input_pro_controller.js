

const Input_pro = require('../models/input_pro_models')

const Counterparty = require('../models/counterparty_models')

exports.getCounterparty = async (req, res) => {
  const { name } = req.query;

  const knex = await Counterparty.knex();

  // Agar name parametri berilmagan bo'lsa, barcha counterpartylarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM counterparty WHERE status != 0
    `);
    return res.json({ success: true, input: data[0] });
  }

  const data = await knex.raw(`
    SELECT id, name FROM counterparty WHERE name LIKE ? AND status != 0 `, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
};



exports.getstatus1 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
  n.id, 
  n.counterparty_id, 
  b.name,
  
  -- Statuslar bo'yicha mahsulotlar soni va jami soni
  COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
 
  
  SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,

  
  -- Statuslar bo'yicha narxlar (dollar va so'm)
  SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_1_narx_dollar,
  SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_1_narx_sum,
  
  MIN(n.created) AS yaratilgan_sana
FROM 
  input_provider AS n
LEFT JOIN 
  input_product AS a ON a.provider_id = n.id
LEFT JOIN 
  counterparty AS b ON b.id = n.counterparty_id
GROUP BY 
  n.id, b.name
ORDER BY
  n.created DESC;
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getstatus2 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
    n.id, 
    n.counterparty_id, 
    b.name,
    
    -- Statuslar bo'yicha mahsulotlar soni va jami soni

    COUNT(CASE WHEN a.status = 2 THEN a.product_id ELSE NULL END) AS status_2_product_soni,


    SUM(CASE WHEN a.status = 2 THEN a.number ELSE 0 END) AS status_2_jami_soni,

    -- Statuslar bo'yicha narxlar (dollar va so'm)

    
    SUM(CASE WHEN a.status = 2 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_2_narx_dollar,
    SUM(CASE WHEN a.status = 2 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_2_narx_sum,
    
  
    
    MIN(n.created) AS yaratilgan_sana
  FROM 
    input_provider AS n
  LEFT JOIN 
    input_product AS a ON a.provider_id = n.id
  LEFT JOIN 
    counterparty AS b ON b.id = n.counterparty_id
  GROUP BY 
    n.id, b.name
  ORDER BY
    n.created DESC;
  
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getstatus3 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
    n.id, 
    n.counterparty_id, 
    b.name,
    
    -- Statuslar bo'yicha mahsulotlar soni va jami soni
   
    COUNT(CASE WHEN a.status = 3 THEN a.product_id ELSE NULL END) AS status_3_product_soni,
   
    
    
    SUM(CASE WHEN a.status = 3 THEN a.number ELSE 0 END) AS status_3_jami_soni,
  
    
    -- Statuslar bo'yicha narxlar (dollar va so'm)
    
    
    SUM(CASE WHEN a.status = 3 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_3_narx_dollar,
    SUM(CASE WHEN a.status = 3 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_3_narx_sum,
  
    MIN(n.created) AS yaratilgan_sana
  FROM 
    input_provider AS n
  LEFT JOIN 
    input_product AS a ON a.provider_id = n.id
  LEFT JOIN 
    counterparty AS b ON b.id = n.counterparty_id
  GROUP BY 
    n.id, b.name
  ORDER BY
    n.created DESC;
  
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};



exports.postInput_pro = async (req, res) => {
    try {
        await Input_pro.query().insert({
            counterparty_id: req.body.counterparty_id,
        });
        return res.status(200).json({ success: true, msg: 'input_pro insert' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

exports.putInput_pro = async (req, res) => {
    try {
        await Input_pro.query().findOne('id', req.params.id).update(req.body);
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

exports.delInput_pro = async (req, res) => {
    try {
        await Input_pro.query().where('id', req.params.id).delete();
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};
//  bu status = 1 uchun
exports.getInput_proTime = async (req, res) => {
    const { startDate, endDate } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const start = startDate && startDate.trim() ? startDate : today;
    const end = endDate && endDate.trim() ? endDate : today;

    const knex = await Input_pro.knex();
    try {
        const data = await knex.raw(
            `
      SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      
      -- Status 1 bo'yicha mahsulotlar soni va jami soni
      COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
      SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,
      
      -- Status 1 bo'yicha narxlar (dollar va so'm)
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_1_narx_dollar,
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_1_narx_sum,
        DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
      FROM 
        input_provider AS n 
      LEFT JOIN      
        input_product AS a ON a.provider_id = n.id 
      LEFT JOIN 
        counterparty AS b ON b.id = n.counterparty_id 
      WHERE 
        n.created BETWEEN ? AND ? AND a.status = 1
      GROUP BY 
        n.id, b.name;
    `,
            [`${start} 00:00:00`, `${end} 23:59:59`]
        );
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};



//  bu status = 1 uchun
exports.getInput_proSearch = async (req, res) => {
  const { name } = req.query;
  const knex = await Input_pro.knex();
  try {
      const data = await knex.raw(
          `
    SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      
      -- Status 1 bo'yicha mahsulotlar soni va jami soni
      COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
      SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,
      
      -- Status 1 bo'yicha narxlar (dollar va so'm)
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_1_narx_dollar,
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_1_narx_sum,
      
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      b.name LIKE ? AND a.status = 1
    GROUP BY 
      n.id, n.counterparty_id, b.name, n.created;
  `,
          [`${name}%`]
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};
