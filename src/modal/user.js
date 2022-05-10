const mongoose = require('mongoose')
const validator = require('validator')
const pswrdVldr = require("password-validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pSchema = new pswrdVldr()
pSchema
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:true
    },
    age: {
        type: Number,
        default: 0,
        trim: true,
        validate(value) { 
            if(value<0) throw new Error('Age should be above 0')
        }
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate(value) { 
            if(!validator.isEmail(value)) throw new Error('Enter valid email id')
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) { 
            if (!pSchema.validate(value)) { 
                throw new Error('Please enter correct password')
            }
        }
    }, 
    tokens: [{
        token: {
            type: String,
           required:true 
        }
    }]
}) 



userSchema.methods.toJSON = function () { 
    const user = this
    const obj = user.toObject()
    
    delete obj.password
    delete obj.tokens 
    return obj
}

userSchema.methods.tokenCreation = async function () { 

    const user = this
    const token = jwt.sign({ id: user._id.toString() }, 'janakiraman')
    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token

}


userSchema.statics.findByCrendentials = async(email, password) => {
    
    const user = await userModal.findOne({ email })
    
    if(!user) throw new Error('Login failed')
    const isValid =await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error({'error':"login failed"})
     
    return user
 }


userSchema.pre('save', async function (next) { 

    const user = this
    if (user.isModified('password')) { 
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const userModal = mongoose.model("User", userSchema)




module.exports = userModal