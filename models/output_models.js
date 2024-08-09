const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class  output extends Model{
    static get tableName(){
        return 'output'
    }
}

module.exports = output