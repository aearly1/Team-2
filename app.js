const mongoose = require('mongoose');
const express= require('express');
const becrypt = require('becrypt');
const jwt = require("jsonwebtoken");
const course = require('./models/course.js');
const department= require('./models/department.js');
const faculty = require('./models/faculty.js')
const location= require('./models/location.js')
const request = require('./models/request.js')
const slot= require('./models/slot.js')
const staffMembers = require('./models/staffMembers.js')

mongoose.connect('mongodb://aearly:aemongo99@peacluster-shard-00-00.zwo5a.mongodb.net:27017,peacluster-shard-00-01.zwo5a.mongodb.net:27017,peacluster-shard-00-02.zwo5a.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-zvq7do-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(async()=>{//idk if putting async here is enough
    const app= express();
    app.use(express.json());
    
    /*this is where we will add our routes*/
    
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})

