const express=require('express');
const app=express();
const PORT=process.env.PORT||5000;
const mongoose=require('mongoose');
const {MONGOURI}=require('./config/keys');

require('./models/user');

const cors=require('cors');
app.use(cors());
app.use(express.json());

// app.use(require('./routes/auth'));
// app.use(require('./routes/user'));

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo db")
})

mongoose.connection.on('error',(err)=>{
    console.log('err connecting',err)
})

app.listen(PORT,()=>{
    console.log("server is running on port",PORT)
})