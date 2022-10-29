const pdf = require('html-pdf');
const { getUMLogo } = require('./imagereader');
const mongoose = require('mongoose');
require('../models/donationModel');
const Donation = mongoose.model('Donation');
const phantom = require('phantomjs')

const receiptTemplate = (donation) =>{
    const date = new Date();
    const image = getUMLogo();

    var tableContent = "";

    if(donation.category=="Money"){
        tableContent = `
            <tr>
                <td>1</td>
                <td>Money</td>
                <td>${donation.amount}</td>
                <td>-</td>
                <td>${donation.amount}</td>
            </tr>
        `
    }
    else{
        tableContent = donation.items.map((item,index)=>{
            return `<tr>
                <td>${index+1}</td>
                <td>${item.description}</td>
                <td>-</td>
                <td>${item.quantity}</td>
                <td>-</td>
            </tr>`
        })
    }

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Receipt</title>
        <style type="text/css" media="print">
            html {
                zoom: 0.55;
            }

            .bold{
                font-weight: bold;
            }

            .grey{
                background-color: #F6F8FB;
            }

            body{
                padding: 50px;
            }

            table{
                margin: 10px 0px;
                width: 100%;
                border-spacing: 0px;
            }

            td{
                border: 1px solid #D9D9D9;
                padding: 10px;
                vertical-align: top;
            }

            img{
                width: 250px;
                padding: 20px;
            }
  
            .align-right{
                text-align: right;
            }
        </style>
    </head>
    <body>
        <table>
            <tr class="grey">
                <td><img src=${image}/></td>
                <td>
                    <p class="bold">RESIT RASMI/ Official Receipt</p>
                    <p class="bold">TARIKH RESIT/</p>
                    <p>Receipt Date: ${date.toISOString().slice(0,10)}</p>
                </td>
            </tr>
        </table>
        <table>
            <tr class="grey">
                <td>
                    <p class="bold">BIL KEPADA/</p>
                    <p>Bill To: ${donation.name}</p>
                </td>
                <td>
                    <p class="bold">NO. RESIT RASMI/</p>
                    <p>Official Receipt No: ${donation._id}</p>
                </td>
            </tr>
            <tr>
                <td rowspan="2">
                    <p class="bold">KETERANGAN/</p>
                    <p>Description: ${donation.charity_event_id.title} Donation</p>
                </td>
                <td>
                    <p class="bold">CARA PEMBAYARAN/</p>
                    <p>Payment Mode: ${donation.category}</p>
                </td>
            </tr>
            <tr>
                <td class="grey">
                    <p class="bold">NO. MATRIK/ STAF /</p>
                    <p>Matric/ Staff No: ${donation.donor_id.identity_no}</p>
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td class="bold">BIL/ No.</td>
                <td class="bold">KETERANAGAN/ Description</td>
                <td class="bold">HARGA SEUNIT (RM)/ Unit cost (MYR)</td>
                <td class="bold">KUANTITI/ Quantity</td>
                <td class="bold">JUMLAH BAYARAN (RM)/ Total Payment (MYR)</td>
            </tr>
            ${tableContent}
            <tr>
                <td colspan="4" class="bold align-right">JUMLAH (RM)</td>
                <td>${donation.amount?donation.amount:"-"}</td>
            </tr>
        </table>
        <div>
            <div>  
                <p>NOTA/Note:</p>
                <p class="bold">Resit Rasmi ini diakui sah setelah penjelasan bayaran diakui oleh bank/</p>
                <p>This Official Receipt is valid subject to your negotiable instrument being cleared by our banker</p>
            </div>
            <div>
                <p class="bold">Resit Rasmi ini dijana oleh komputer, tandatangan tidak diperlukan/</p>
            </div>
        </div>
    </body>
    </html>
    `
}
const generateReceipt = async (donation) => {

    // await pdf.create(receiptTemplate(donation),{}).toFile(`receipt/${donation._id}.pdf`,(err,res)=>{
    //     if(err){
    //         return Promise.reject();
    //     }
    //     return Promise.resolve();
    // })

    await pdf.create(receiptTemplate(donation), {phantomPath: phantom.path,childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer((err,buffer)=>{
        const receipt = {
            name:donation._id+'.pdf',
            content:'data:application/pdf;base64,'+buffer.toString('base64')
        }
        Donation.findByIdAndUpdate(donation._id,{receipt},{new:false},(err,result)=>{
            if(err){
                console.log(err)
            }
        })
    })

}

module.exports = {generateReceipt};