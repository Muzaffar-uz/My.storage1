

const Input_pro = require('../models/input_pro_models')

const Counterparty = require('../models/counterparty_models')

exports.getCounterparty = async (req, res) => {
  // Parametrni olish
  const { name } = req.query;

  // Agar name parametrini berilmasa, xato xabarini qaytarish
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Qidirish uchun parametr ko\'rsatilmagan.'
    });
  }
 const knex = await Counterparty.knex();

    // SQL so'rovini xavfsiz usulda bajarish
    const data = await knex.raw(`
      SELECT id, name 
      FROM counterparty 
      WHERE name LIKE ?`, [`${name}%`]);
      // console.log('API javobi:', data)
    return res.json({success: true,input: data[0] });
    
  }
 
 
  // exports.getCounterparty = async (req, res) => {
  
  //   const { name } = req.query; // GET so'rovlaridan qidiruv termi
  
  //   // if (!name) {
  //   //   return res.status(400).json({
  //   //     success: false,
  //   //     message: 'Qidiruv uchun parametr ko\'rsatilmagan.'
  //   //   });
  //   // }
  
  //   try {
  //     const knex = await Input_pro.knex();
      
  //     // Qidiruvni parametrli so'rov orqali amalga oshiramiz
  //     const result = await knex.raw(`
  //       SELECT n.id, n.counterparty_id, a.name 
  //       FROM input_provider AS n 
  //       LEFT JOIN counterparty AS a ON a.id = n.counterparty_id 
  //       WHERE a.name LIKE ?
  //     `, [`%${name}%`]); 
  //     console.log(name);
      
  //     return res.status(200).json({
  //       success: true,
  //       clients: result[0]  // Natijalarni qaytarish
  //     });
    
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       error: error // Xatolikni yaxshiroq ko'rsatish
  //     });
  //   }
  // };
  




exports.getInput_pro = async (req, res) => {
    try {
        const input_pro = await Input_pro.query().select(
            'input_provider.id', 
            'counterparty.id as counterparty_id', 
            'counterparty.name as counterparty', 
            'input_provider.count', 
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
    count: req.body.count,
    summ: req.body.summ
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