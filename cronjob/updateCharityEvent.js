const cron = require('node-cron');
const mongoose = require("mongoose");
const CharityEvent = mongoose.model('CharityEvent');

const checkEventStatus = (event) => {
    const date = new Date();
    if(event.status==="In Progress"&&date>event.donation_end_date){
        return "Closed";
    }
    if(event.status==="Preregistration"&&date>event.preregister_end_date){
        return "In Progress";
    }
    if(event.status==="Not Started"&&date>event.preregister_start_date){
        return "Preregistration";
    }
    return "";
}
cron.schedule("* 0 * * * *",()=>{
    CharityEvent.find({ "status" : { "$in": ["Not Started", "In Progress", "Preregistration"] }})
    .select('-photo')
    .select('-document')
    .then((events)=>{
        events.forEach((event)=>{
            const status = checkEventStatus(event);
            if(status){
                console.log("Need Updated");
                CharityEvent.findByIdAndUpdate(event._id,{status},{new:false},(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                        console.log("Successfully updated");
                })
            }
        })
    })
    .catch(err=>{
        console.log(err)
    })
})