const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// dasturni tahlil qilish/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// ilovani jsonli tahlil qilish
app.use(bodyParser.json())

const UsreRouter = require('./router/user_router')

app.use('/user',UsreRouter)

app.listen('3000',()=>{
    console.log('server running');
})