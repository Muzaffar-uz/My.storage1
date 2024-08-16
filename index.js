const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// dasturni tahlil qilish/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// ilovani jsonli tahlil qilish
app.use(bodyParser.json())

const UsreRouter = require('./router/user_router')
const ProductRouter =require('./router/product_router')
const InputRouter = require('./router/input_router')
const OutputRouter = require('./router/output_router')
const CounterpartyRouter = require('./router/counterparty_router')
const Group_product = require("./router/group_product_router")
const CategoryRouter = require("./router/category_router")
const currencyRouter = require('./router/currency_router')

app.use('/user',UsreRouter)
app.use('/product',ProductRouter)
app.use('/input',InputRouter)
app.use('/output',OutputRouter)
app.use('/counterparty',CounterpartyRouter)
app.use('/group',Group_product)
app.use('/category',CategoryRouter)
app.use("/currency",currencyRouter)

app.listen('3000',()=>{
    console.log('server running');
})