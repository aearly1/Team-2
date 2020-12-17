const mongoose = require('mongoose');
const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const course = require('../models/course.js');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');
const key = "qofhiqoh38hfqfh3109fjqpjf";

mongoose.connect('mongodb+srv://dbAdmin:ZerebewZobrew1@cluster0.14yo5.mongodb.net/test?retryWrites=true&w=majority')
.then(async()=>{//idk if putting async here is enough
    const app= express();
    app.use(express.json());
    app.post('/login',async(req,res)=>{
        const staffMem =await staffMembers.findOne({email:req.body.email})
        if(!staffMem)
        return res.status(403).send("go away big gay")
        const verified = await bcrypt.compare(req.body.password,staffMem.password)
        if(!verified)
        return res.status(403).send("wrong pass, go away big gay")
        const payload = {id:staffMem.id,type:staffMem.type}
        const token = jwt.sign(payload,key)
        res.header('auth-token',token)
        res.status(200).send("login successful")
    })
    
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})
//module.exports.app = app