const Product = require("../models/product_models");


exports.getProduct = async (req, res) => {
  const product = await Product.query().where("*").first();
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
  await Product.query().insert({
    name: req.body.name,
    categoriy_id: req.body.categoriy_id,
    namber_produc: req.body.namber_produc,
  });
  return res.status(200).json({ success: true, msg: "new Product insert" });
};

exports.putProduct = async (req, res) => {
  const d = new Date();
  await Product.query().where("id", req.params.id).update({
    name: req.body.name,
    value_id: req.body.value_id,
    group_id: req.body.group_id,
    summ: req.body.summ,
    update: d,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};

