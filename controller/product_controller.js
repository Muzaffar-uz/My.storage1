const Product = require("../models/product_models");


exports.getProduct = async (req, res) => {
  const product = await Product.query().select("*").first();
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
  await Product.query().insert({
    name: req.body.name,
    group_id: req.body.group_id,
    currency_id:req.body.currency_id,
    price: req.body.price,

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
    update: d,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};

