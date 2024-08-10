const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class Currency extends Model{
    static get tableName(){
        return 'Currevcy'
    }

}

module.exports = Currency