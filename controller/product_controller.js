const group_product = require("../models/group_product_models");
const Product = require("../models/product_models");


exports.getProduct = async (req, res) => {
  const product = await Product.query().select("*")
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
   await Product.query().insert({
    name: req.body.name,
    group_id: req.body.group_id,
    });
    // to'g'ridan to'g'ri categoryga update bo'ladi
   const category = await group_product.query().where("id", req.body.group_id).first();
    await Product.query().where('group_id', req.body.group_id).update({
        category_id: category.categoriy_id
      })

  return res.status(200).json({ success: true, msg: "new Product insert" });
};

exports.putProduct = async (req, res) => {
  const d = new Date();
  await Product.query().where("id", req.params.id).update({
    name: req.body.name,
    // gourp o'zgarmin duribdi
    group_id: req.body.group_id,  
    category_id: req.body.category_id,
    updated: d,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", req.params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};

