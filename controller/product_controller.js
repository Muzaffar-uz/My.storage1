const group_product = require("../models/group_product_models");
const Product = require("../models/product_models");
const { select } = require("../setting/db");


exports.getProduct = async (req, res) => {
  
  const product = await Product.query().select('*').where('group_id', req.params.id)
  
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
   await Product.query().insert({
    name: req.body.name,
     group_id: req.body.group_id,
    // category_id: req.body.category_id,
    price_1:req.body.price_1,
    price_2: req.body.price_2,
    price_3: req.body.price_3,
    currency_id: req.body.currency_id,
    status: req.body.status
});
    // to'g'ridan to'g'ri categoryga update bo'ladi
  //  const category = await group_product.query().where("id", req.body.group_id).first();
  //   await Product.query().where('group_id', req.body.group_id).update({
  //       category_id: category.categoriy_id
  //     })

  return res.status(200).json({ success: true, msg: "new Product insert" });
};

exports.putProduct = async (req, res) => {
  const d = new Date();
  await Product.query().where("id", req.params.id).update({
    name: req.body.name,
    // gourp o'zgarmin duribdi
    group_id: req.params.id,  
    category_id: req.body.category_id,
    price_1:req.body.price_1,
    price_2: req.body.price_2,
    price_3: req.body.price_3,
    currency_id: req.body.currency_id,
    status: req.body.status,
    updated: d,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", req.params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};

