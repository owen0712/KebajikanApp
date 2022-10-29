const nodemailer = require('nodemailer');
const {NODEMAILER_EMAIL,NODEMAILER_PASSWORD} = require('../config/keys');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
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

const sendReceiptEmail = async({destinationEmail,subject,content,attachment}) =>{

    let result = false;

    const options = {
        from:NODEMAILER_EMAIL,
        to:destinationEmail,
        subject,
        html:content,
        attachments:{
            filename: attachment.name,
            content: attachment.content.split("base64,")[1],
            contentType: 'application/pdf',
            encoding: 'base64'
        },
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

module.exports={sendMail,sendReceiptEmail};