

const Input_pro = require('../models/input_pro_models')

const Counterparty = require('../models/counterparty_models')

exports.getCounterparty = async (req, res) => {
  const { name } = req.query;

  const knex = await Counterparty.knex();

  // Agar name parametri berilmagan bo'lsa, barcha counterpartylarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM counterparty
    `);
    return res.json({ success: true, input: data[0] });
  }

  const data = await knex.raw(`
    SELECT id, name FROM counterparty WHERE name LIKE ?`, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
};

exports.getInput_pro = async (req, res) => {
    const knex = await Input_pro.knex();
    try {
        const data = await knex.raw(`
      SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      count(a.product_id) as product_soni,
      SUM(a.number) AS jami_soni, 
      SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
      SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
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
       n.created DESC
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

exports.getInput_proTime = async (req, res) => {
    const { startDate, endDate } = req.query;
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
        count(a.product_id) as product_soni,
        SUM(a.number) AS jami_soni, 
        SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
        SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
        DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
      FROM 
        input_provider AS n 
      LEFT JOIN      
        input_product AS a ON a.provider_id = n.id 
      LEFT JOIN 
        counterparty AS b ON b.id = n.counterparty_id 
      WHERE 
        n.created BETWEEN ? AND ?
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
        COUNT(a.product_id) as product_soni,  
        SUM(a.number) AS jami_soni,  
        SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
        SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
        DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
      FROM 
        input_provider AS n 
      LEFT JOIN      
        input_product AS a ON a.provider_id = n.id 
      LEFT JOIN 
        counterparty AS b ON b.id = n.counterparty_id 
      WHERE b.name LIKE ?
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