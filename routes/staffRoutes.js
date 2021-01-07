const mongoose = require('mongoose');
const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const staffMembers = require('../models/staffMembers.js');
const request = require('../models/request')
const connectDB = require("../config/db");
const auth = require('../middleware/auth.js')
const app= express.Router();
const blacklist = auth.blacklist
const key = auth.key
const { body, validationResult, check } = require('express-validator');
const missinghrs = require('../functions/funcs').missinghours
const missingdays = require('../functions/funcs').missingdays
//connectDB()
//.then(async()=>{
    //app.use(auth.func)
    app.post('/logout',(req,res)=>{
        blacklist.push(req.header('auth-token'))
        res.status(200).send("Logout successful")
    })
    app.get('/profile',async(req,res)=>{
        let staffMem = await staffMembers.findOne({email:req.user.email});
        if(!staffMem)
        return res.status(404).send("User not found")
        let out = {
            Name: staffMem.name,
            Email: staffMem.email,
            ID: staffMem.id,
            Office: staffMem.office,
            FacultyName: staffMem.facultyName,
            DepartmentName: staffMem.departmentName,
            Courses: staffMem.courses,
            DayOff: staffMem.dayOff,
            annualLeaves: staffMem.annualLeaves,
            accidentalLeavesLeft: staffMem.accidentalLeavesLeft,
            Salary: staffMem.Salary,
            Type: staffMem.type,
            img: staffMem.imgLink
        }
        res.status(200).send(out);
    })
    
    app.put('/profile/update',
    [
        check('office').isString().withMessage("Please Enter a Valid Office"),
        check('email').isEmail().withMessage("Please Enter a Valid Email"),
        check('salary').isNumeric().withMessage("Please Enter a Correct Value"),
        check('department').isString().withMessage("Please Enter a Valid Department"),
        check('faculty').isString().withMessage("Please Enter a Valid Faculty")
    ],async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
        if(!u)
        return res.status(404).send("User not found")
        if(req.body.office)
        u.office = req.body.office
        if(req.body.email)
        u.email = req.body.email
        if(req.user.type!="academic"){
            if(req.body.salary)
            u.Salary=req.body.salary
            if(req.body.department)
            u.departmentName=req.body.department
            if(req.body.faculty)
            u.facultyName=req.body.faculty
        }
        await staffMembers.findOneAndUpdate({email:req.user.email},{office:u.office})
        await staffMembers.findOneAndUpdate({email:req.user.email},{email:u.email})
        await staffMembers.findOneAndUpdate({email:req.user.email},{Salary:u.Salary})
        await staffMembers.findOneAndUpdate({email:req.user.email},{departmentName:u.departmentName})
        await staffMembers.findOneAndUpdate({email:req.user.email},{facultyName:u.facultyName})
        //await u.save()
        blacklist.push(req.header("auth-token"))
        res.status(200).send("Profile Updated. Relog to save changes.")
    })
    app.put('/passwordreset',
    [
        body('oldpassword').isString().isLength({ min: 5 }),
        body('newpassword').isString().isLength({ min: 5 })
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let u = await staffMembers.findOne({email:req.user.email});
        let oldpass = req.body.oldpassword
        let newpass = req.body.newpassword
        if(!(oldpass && newpass))
        return res.status(403).send("Enter Your Current & New Passwords")
        const verified = await bcrypt.compare(oldpass,u.password)
        if(!verified)
        return res.status(403).send("Your current password does not match")
        const salt = await bcrypt.genSalt(12)
        const hashedPassword =await bcrypt.hash(newpass,salt)
        await staffMembers.findOneAndUpdate({email:req.user.email},{password: hashedPassword,firstLogin:false})
        blacklist.push(req.header("auth-token"))
        res.status(200).send("Password Changed. Please Relog")
    })
    app.post('/signin',async(req,res)=>{        
        var today = new Date();
        if(today.getHours()>19 || today.getHours()<7)
        return res.status(401).send("Working hours start from 0700 to 1900")
        let u = await staffMembers.findOne({email:req.user.email});
        let lastop = u.attendance.pop()
        if(lastop)
        if(lastop.op == "sign out")
        u.attendance.push(lastop)
        u.attendance.push({op:"sign in", time: today})
        await staffMembers.findOneAndUpdate({email:req.user.email},{attendance: u.attendance})
        res.status(200).send(u.attendance)
       
        //await u.save()
    })

    app.post('/signout',async(req,res)=>{        
        var today = new Date();
        var dayoff = 0;
        var minspent=0;
        let u = await staffMembers.findOne({email:req.user.email});
        let lastop = u.attendance.pop()
        if(!lastop)
        res.status(401).send("Sign in first")
        u.attendance.push(lastop)
        switch (u.dayOff) {
            case "SAT":
                dayoff=6
                break;
            case "SUN":
                dayoff=0
            case "MON":
                dayoff=1
                break;
            case "TUE":
                dayoff=2
                break;
            case "WED":
                dayoff=3
                break;
            case "THU":
                dayoff=4
                break;
            case "FRI":
                dayoff=5
                break;
        }
        let arr = u.attendance.filter(function(elem){
            return elem.time.getMonth()==today.getMonth() && elem.time.getDate()==elem.time.getDate() && elem.op=="sign out"
        })
        if(lastop.op == "sign in"){
        minspent = (today.getTime()-lastop.time.getTime())/(1000*60)
        if(today.getHours()>19 || today.getHours()<7)
        {
            let tmp = lastop.time;
            tmp.setHours(19,0);
        minspent = (tmp.getTime()-lastop.time.getTime())/(1000*60)
        }
        if(dayoff==today.getDay()||(arr.length!=0))
        u.attendance.push({op:"sign out", time: today,net:minspent})
        else
        u.attendance.push({op:"sign out", time: today,net:minspent-504})
        res.status(200).send(u.attendance)
        await staffMembers.findOneAndUpdate({email:req.user.email},{attendance: u.attendance})
        }
        else
        res.status(401).send("Cannot sign out before signing in")
    })
    app.get('/attendance/:month',async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
            let curr = new Date()
            let month = parseInt(req.params.month,10)
            if(month > 12 || month <= 0)
            return res.status(401).send("Please enter a valid month")
            let max = new Date()
            month--;
            max.setMonth(month,10)
            max.setHours(20)
            let min = new Date()
            min.setMonth(month-1,11)
            min.setHours(6)
            let att = u.attendance.filter(function(elem){
                let d = elem.time
                return  d.getTime()>min.getTime() && d.getTime() < max.getTime()
            })

            res.status(200).send(att)
        
    })

    app.get('/attendance',async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
        res.status(200).send(u.attendance)
        
    })
    /*DIAB ADDED THIS FOR FRONTEND*/
    app.get('/name',async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
        res.status(200).send(u.name)
        
    })
    /*=============*/
    app.get('/missingdays',async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
        var out = []
        const sent = u.sentRequests
        if(sent.length == 0)
        return res.send(missingdays(u))
        for (let i = 0; i < sent.length; i++) {
            let r = await request.findById(sent[i])
            if(r.status == 'accepted')
            out.push(r)
        }
        const miss = missingdays(u)
        var outrl = []
        for (let i = 0; i < miss.length; i++) {
            for (let j = 0; j < out.length; j++) {
                let x = out[j]
                let y = miss[i]
                if((y.Day < x.startOfLeave.getDate() && y.Month == x.startOfLeave.getMonth()+1)|| (y.Day > x.endOfLeave.getDate() && y.Month == x.endOfLeave.getMonth()+1))
                outrl.push(y)
            }
        }
        
        console.log(req.originalUrl)
        res.send(outrl)
    })
    app.get('/missinghours',async(req,res)=>{
        let u = await staffMembers.findOne({email:req.user.email});
        res.send(missinghrs(u))
    })

    
    /*app.listen(3000, function()
    {
        console.log("Server started at port 3000");
    });
/*})
.catch((err)=>{
    console.log(err)
})*/
module.exports = app
