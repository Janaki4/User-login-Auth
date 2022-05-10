const { use } = require('express/lib/application')
const jwt = require('jsonwebtoken')
const UserModel= require('../modal/user')


const auth = async(req,res,next) => { 
    try {
        const token = req.header("Authorization").replace("Bearer ", '')
        const decoded = jwt.verify(token, 'janakiraman')
        console.log(decoded)
        const user = await UserModel.findOne({_id:decoded.id , 'tokens.token':token})
        if (!user) throw new Error()
        req.user = user
        req.token=token
        next()
        } catch (error) {
        res.status(401).send('Please enter correct credentials')
        }
    }

module.exports = auth