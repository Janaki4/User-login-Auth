const express = require('express')
const app = express() 
const userRouter= require('./router/user')
require('./db/mongoose')


app.use(express.json())
const port = process.env.PORT || 3000


app.use(userRouter)


app.listen(port, () => { 
    console.log(port)
})