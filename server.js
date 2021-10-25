const express= require('express');
const app = express();
const port = 8080;
const cors = require('cors');
require('dotenv').config(); // 환경설정 파일

app.use(cors());
app.use(express.json());

var id = 'sam'
var pwd = 'sam1234'

var mongoose = require("mongoose");
mongoose.connect(`mongodb://${id}:${pwd}@13.209.66.117:27017/admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error("mongoDB Connection Error!", err);
    }
    console.log("mongoDB Connected!");

    // Server Open
    app.listen(port, function () {
        console.log(`Server listening on port ${port}!`);
    });
});
app.get('/', function(req, res){ 
    res.sendFile(__dirname+'/bin/index.html')
}); // change the path to your index.html });

// router 사용
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)
