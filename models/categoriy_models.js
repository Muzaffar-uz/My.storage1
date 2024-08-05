const {Model} = require("objection")

const knex = require('../setting/db')

Model.knex(knex)

class Categoriy extends Model{
    static get tableName(){
        return 'categoriy'
    }
}

module.exports = Categoriy