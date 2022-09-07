const nodemailer = require('nodemailer');
const {NODEMAILER_EMAIL,NODEMAILER_PASSWORD} = require('../config/keys');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user:NODEMAILER_EMAIL,
        pass:NODEMAILER_PASSWORD
    },
})

const sendMail = async({destinationEmail,subject,content}) =>{
    let result = false;

    const options = {
        from:NODEMAILER_EMAIL,
        to:destinationEmail,
        subject,
        html:content
    }

    await transporter.sendMail(options).then((err,info)=>{
        if(err){
            console.log(err)
            result=false;
        }
        else{
            result=true;
        }
    })

    return result;
}

module.exports=sendMail;