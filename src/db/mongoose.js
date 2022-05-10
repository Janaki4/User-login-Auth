const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/USER", {
    useNewUrlParser:true
})



// const userModal = mongoose.model("User", {
//     name: {
//         type:String
//     }
// })

// const User = new userModal({ name: "janakiraman"})
// User.save().then(() => { console.log(User) }).catch((e) => { console.log(e)})