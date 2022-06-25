const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');

require('./models/userModel');
require('./models/charityEventModel');
require('./models/partTimeJobModel');
require('./models/charityApplicationModel');
require('./models/jobApplicationModel');
require('./models/announcementModel');

const cors = require('cors');
app.use(cors());
app.use(express.json({limit: '50mb'}));

app.use(require('./routes/authenticationRoute'));
app.use(require('./routes/userRoute'));
app.use(require('./routes/charityEventRoute'));
app.use(require('./routes/partTimeJobRoute'));
app.use(require('./routes/charityApplicationRoute'));
app.use(require('./routes/jobApplicationRoute'));
app.use(require('./routes/announcementRoute'));

if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => {
    console.log("connected to mongo db")
})

mongoose.connection.on('error', (err) => {
    console.log('err connecting', err)
})

app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})