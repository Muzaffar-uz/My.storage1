const kenx = require('../setting/db')
const {Model} = require('objection')

Model.kenx(kenx)

class Order_product extends Model{
    static get tableName(){
        return 'order_product'
    }
    
}
module.exports = Order_product