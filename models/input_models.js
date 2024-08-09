const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class  input extends Model{
    static get tableName(){
        return 'input'
    }
}

module.exports = input