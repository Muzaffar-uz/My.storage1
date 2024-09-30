

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
    try {
        const input_pro = await Input_pro.query().select(
            'input_provider.id', 
            'counterparty.id as counterparty_id', 
            'counterparty.name as counterparty', 
            'input_provider.count', 
            'input_provider.summ$', 
            'input_provider.summ',
            'input_provider.created'
        )
        .leftJoin('counterparty', 'counterparty.id', 'input_provider.counterparty_id');
        
        res.status(200).json({succcess:true,input_pro:input_pro});
    } catch (e) {
        res.status(500).json({ error: e });
    }
};


exports.postInput_pro = async (req,res) =>{
 try{ await Input_pro.query().insert({
  counterparty_id: req.body.counterparty_id,

  }
  )
  return res.status(200).json({success:true, msg: " input_pro insort"})}catch(e){
    res.status(500).json({ error: e});
  }
}




exports.putInput_pro = async (req,res)=>{
    try{await Input_pro.query().findOne('id', req.params.id).update(req.body)
    return res.status(200).json({success:true})}catch(e){
        res.status(500).json({ error: e});
      }
}

exports.delInput_pro = async (req,res)=>{
   try{ await Input_pro.query().where('id',req.params.id).delete()
    return res.status(200).json({success:true})}catch(e){
        res.status(500).json({ error: e});
    }
}