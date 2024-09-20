const Input_pro = require('../models/input_pro_models')


exports.getInput_pro = async (req,res) =>{
    const input_pro = await Input_pro.query().select('*')
    return res.status(200).json({success:true , input_pro : input_pro})
}