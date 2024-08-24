const Product = require("../models/product_models");


exports.getProduct = async (req, res) => {
  const product = await Product.query().select("*")
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
   await Product.query().insert({
    name: req.body.name,
    group_id: req.body.group_id,
    currency_id:req.body.currency_id,
    price_1: req.body.price_1,
    price_2: req.body.price_2,
    price_3: req.body.price_3,
    price_4: req.body.price_4,
  
  });
  return res.status(200).json({ success: true, msg: "new Product insert" });
};

exports.putProduct = async (req, res) => {
  const d = new Date();
  await Product.query().where("id", req.params.id).update({
    name: req.body.name,
    group_id: req.body.group_id,
    currency_id:req.body.currency_id,
    price: req.body.price,
    updated: d,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", req.params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};

