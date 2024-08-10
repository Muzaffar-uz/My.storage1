const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class groupp_product extends Model{
    static get tableName(){
        return 'group_praduct'
    }
}
module.exports = groupp_product