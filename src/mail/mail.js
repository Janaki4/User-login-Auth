const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    service: "outlook",
    port: 587,
    secure:false,
    auth: {
        user: "janakiraman12345678900@outlook.com",
        pass:"Janakiraman00."
    }
})

const joiningMail =async (email, name) => {
    console.log('working')
   await transporter.sendMail({
        from: "janakiraman12345678900@outlook.com",
        to: `${email}`,
        subject: `Thanks for creating Acc with us ${name}`,
        text: `Thanks for creating acc`,
        html: `<p style="color:blue;font-size:46px;background-color:black;color:white">${name} </p>`
    })
    
}

const farewellMail =async (email, name) => {
        await transporter.sendMail({
        from: "janakiraman12345678900@outlook.com",
        to: `${email}`,
        subject: `Farewell ${name}`,
        text: `Hope, We will see u soon`,
        html: `<p style="color:blue;font-size:46px;background-color:black;color:white">${name} </p>`
    })
    
}
 
// joiningMail('janakiraman781@gmail.com' , 'interviewer' )

module.exports = {
    joiningMail, 
    farewellMail
}