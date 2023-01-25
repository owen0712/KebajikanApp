const cron = require('node-cron');
const mongoose = require("mongoose");
const PartTimeJob = mongoose.model('PartTimeJob');
const JobApplication = mongoose.model('JobApplication');

const checkJobStatus = (job) => {
    const date = new Date();
    if(job.status==="Available"&&(date>job.closed_date || job.required_student<=job.allocated_student.length)){
        return "Closed";
    }
    return "";
}
cron.schedule("* * * * * *",()=>{
    PartTimeJob.find({ "status" : { "$in": ["Closed", "Available"] }})
    .select('-photo')
    .then((jobs)=>{
        jobs.forEach((job)=>{
            const status = checkJobStatus(job);
            if(status){
                PartTimeJob.findByIdAndUpdate(job._id,{status},{new:false},(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    console.log("Successfully updated");
                })
            }
            if(status=="Closed"){
                JobApplication.updateMany({"job_id":job._id,"status":"Pending"},{status:"Rejected"},(err,result)=>{
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