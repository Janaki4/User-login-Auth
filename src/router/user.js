const express = require('express')
const userModal= require('../modal/user')
const router = new express.Router()
 const auth =require('../middleware/auth')
const res = require('express/lib/response')
const { joiningMail , farewellMail} =require('../mail/mail')


router.post('/users', async(req, res) => {
    
    try {
        const User = new userModal(req.body)
        joiningMail(User.email , User.name)
        const token = await User.tokenCreation()
         return res.status(201).send({User ,token })
    }
    catch (e) { 
         res.status(400).send(e)
    }
   
    // User.save().then(() => { res.status(201).send(User) }).catch((e) => { res.status(400).send(e) })

})


router.post('/users/login', async (req, res) => {
    try {
        const user = await userModal.findByCrendentials(req.body.email, req.body.password)
        const token = await user.tokenCreation()
        res.status(201).send({user , token})
    } catch (error) {
        res.status(401).send(error)
    }
    
})

router.get('/users/me', auth, (req, res) => { 
    res.send(req.user)
})


router.post('/users/logout', auth, async(req, res) => { 

    try {
        req.user.tokens = req.user.tokens.filter((tkn) => { 
            return tkn.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send("All users are logged out")
    }
 })


router.patch("/users/me", auth ,async (req, res) => {
    try {
        const keys = Object.keys(req.body)
        const defaultKeys = ['name', 'age', 'password', 'email']
        const isKeyValid = keys.every((key) => defaultKeys.includes(key))
        
        if (!isKeyValid) return res.status(404).send('Enter the correct field to update')
        
        // const fetchUser = await userModal.findById(req.params.id)

        keys.forEach((key) => { 
            req.user[key]=req.body[key]
        })
            await req.user.save()
        
        // const updatedUser = await userModal.findByIdAndUpdate(req.params.id, req.body, {new:true , runValidators:true} )
        // if (!fetchUser) return res.status(404).send(fetchUser)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }

 })
 

router.delete("/users/me",auth, async(req,res) => {

    try {
        // const deletedUser = await userModal.findByIdAndDelete(req.params.id)
        // if (!deletedUser) { 
        //     return res.status(404).send('no user found')
        // }
        farewellMail(req.user.email , req.user.name)
       await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports=router