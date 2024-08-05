const {Model} = require('objection')
const kenx = require('../setting/db')

Model.knex(knex)

class product extends Model{
    static get tableName{
        return 'product'
    }
}

module.exports = product