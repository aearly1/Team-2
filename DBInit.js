const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const course = require('./models/course');
const department= require('./models/department.js');
const faculty = require('./models/faculty.js')
const location= require('./models/location.js')
const request = require('./models/request.js')
const slot= require('./models/slot.js')
const staffMembers = require('./models/staffMembers.js');
const bcrypt = require('bcryptjs')

router.route('/')
//DB initialization
.post(async(req,res)=>{

})
router.get('/staffMems',async(req,res)=>{
    const salt = await bcrypt.genSalt(12)
    const hashedPassword =await bcrypt.hash("passwordsha2y",salt) 
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: hashedPassword,
            id: "43-8530",
            name: "7amada sha3r",
            type: "Academic", // can either be HR or academic
            office: "C4.404",
            dayOff: "Saturday",
            facultyName: "Tegara", //null for HR
            departmentName: "Fawanees", //null for HR or just set to HR
            attendance: [],
            courses: ["ABC123","XYZ567"], //array with course ids of courses they teach && empty list in case of HR
            annualLeaves: 5,
            Salary: 10
        })
        await mem.save()
    res.status(200).send("Seeded for testing staff routes")
})
module.exports=router;