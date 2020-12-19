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
const blacklist = []
mongoose.connect('mongodb+srv://dbAdmin:ZerebewZobrew1@cluster0.14yo5.mongodb.net/test?retryWrites=true&w=majority')
.then(async()=>{
    const app= express();
    app.use(express.json());
    app.post('/login',async(req,res)=>{
        const staffMem =await staffMembers.findOne({email:req.body.email})
        if(!staffMem)
        return res.status(403).send("go away big gay")
        const verified = await bcrypt.compare(req.body.password,staffMem.password)
        if(!verified)
        return res.status(403).send("wrong pass, go away big gay")
        const payload = {email:staffMem.email,type:staffMem.type}
        const token = jwt.sign(payload,key)
        res.header('auth-token',token)
        res.status(200).send("login successful")
    })
    app.use(authenticate)
    app.post('/logout',(req,res)=>{
        blacklist.push(req.header('auth-token'))
        res.status(200).send("logout successful")
    })
    app.get('/profile',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let staffMem = await staffMembers.findOne({email:payload.email});
        if(!staffMem)
        return res.status(404).send("not found")
        let x = staffMem.scheduleSlots;
        let slots = []
        slots.push( await slot.findById(x[0]));
        let out = {
            Name: staffMem.name,
            ID: staffMem.id,
            Office: staffMem.office,
            FacultyName: staffMem.facultyName,
            DepartmentName: staffMem.departmentName,
            Courses: staffMem.courses,
            Slots: slots,
            Attendance: staffMem.attendance,
            DayOff: staffMem.dayOff,
            sentRequests: staffMem.sentRequests,
            receivedRequests: staffMem.receivedRequests,
            annualLeaves: staffMem.annualLeaves,
            accidentalLeavesLeft: staffMem.accidentalLeavesLeft,
            Salary: staffMem.Salary
        }
        res.status(200).send(out);
    })
    
    app.put('/profile/update',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        if(req.body.office)
        u.office = req.body.office
        if(req.body.email)
        u.email = req.body.email
        console.log(payload.type)
        if(payload.type!="Academic"){
            if(req.body.salary)
            u.Salary=req.body.salary
            if(req.body.department)
            u.departmentName=req.body.department
            if(req.body.faculty)
            u.facultyName=req.body.faculty
        }
        await staffMembers.findOneAndUpdate({email:payload.email},{office:u.office})
        await staffMembers.findOneAndUpdate({email:payload.email},{email:u.email})
        await staffMembers.findOneAndUpdate({email:payload.email},{Salary:u.Salary})
        await staffMembers.findOneAndUpdate({email:payload.email},{departmentName:u.departmentName})
        await staffMembers.findOneAndUpdate({email:payload.email},{facultyName:u.facultyName})
        //await u.save()
        res.status(200).send("Profile Updated")
    })
    app.put('/passwordreset',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let oldpass = req.body.oldpassword
        let newpass = req.body.newpassword
        if(!(oldpass && newpass))
        return res.status(403).send("Enter password")
        const verified = await bcrypt.compare(oldpass,u.password)
        if(!verified)
        return res.status(403).send("wrong pass")
        const salt = await bcrypt.genSalt(12)
        const hashedPassword =await bcrypt.hash(newpass,salt)
        await staffMembers.findOneAndUpdate({email:payload.email},{password: hashedPassword})
        res.status(200).send("Password Changed")
    })
    app.post('/signin',async(req,res)=>{        
        var today = new Date();
        if(today.getHours()>19 || today.getHours()<7)
        return res.status(401).send("Working hours start from 0700 to 1900")
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let lastop = u.attendance.pop()
        console.log(lastop)
        if(lastop)
        if(lastop.op == "sign out")
        u.attendance.push(lastop)
        u.attendance.push({op:"sign in", time: today})
        await staffMembers.findOneAndUpdate({email:payload.email},{attendance: u.attendance})
        res.status(200).send(u.attendance)
       
        //await u.save()
    })

    app.post('/signout',async(req,res)=>{        
        var today = new Date();
        var dayoff = 0;
        var minspent=0;
        if(today.getHours()>19 || today.getHours()<7)
        return res.status(401).send("Working hours start from 0700 to 1900")
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let lastop = u.attendance.pop()
        if(!lastop)
        res.status(401).send("Sign in first")
        u.attendance.push(lastop)
        switch (u.dayOff) {
            case "Saturday":
                dayoff=6
                break;
            case "Sunday":
                dayoff=0
            case "Monday":
                dayoff=1
                break;
            case "Tuesday":
                dayoff=2
                break;
            case "Wednesday":
                dayoff=3
                break;
            case "Thursday":
                dayoff=4
                break;
            case "Friday":
                dayoff=5
                break;
        }
        let arr = u.attendance.filter(function(elem){
            return elem.time.getMonth()==today.getMonth() && elem.time.getDate()==elem.time.getDate() && elem.op=="sign out"
        })
        if(lastop.op == "sign in"){
        minspent = (today.getTime()-lastop.time.getTime())/(1000*60)
        if(dayoff==today.getDay()||(arr.length!=0))
        u.attendance.push({op:"sign out", time: today,net:minspent})
        else
        u.attendance.push({op:"sign out", time: today,net:minspent-504})
        res.status(200).send(u.attendance)
        await staffMembers.findOneAndUpdate({email:payload.email},{attendance: u.attendance})
        }
        else
        res.status(401).send("cannot sign out before signing in")
    })
    app.get('/attendance/:month',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        console.log(u.attendance)
            let curr = new Date()
            let month = req.params.month
            let max = new Date()
            max.setMonth(month,10)
            max.setHours(19)
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
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        res.status(200).send(u.attendance)
        
    })

    app.get('/missingdays',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let dayoff = u.dayOff
        let today = new Date()
        let month = today.getMonth()
        if(today.getDate()>10)
        month++;
        let curr = new Date()
        let mont = curr.getMonth()
        if(curr.getDate()>10)
        mont++
        let max = new Date()
        max.setMonth(mont,10)
        max.setHours(19)
        let min = new Date()
        min.setMonth(mont-1,11)
        min.setHours(6)
        const missingdays= []
        let att = u.attendance.filter(function(elem){
            let d = elem.time
            return elem.op == "sign out" && d.getTime()>min.getTime() && d.getTime() < max.getTime() 
        })
        switch (u.dayOff) {
            case "Saturday":
                dayoff=6
                break;
            case "Sunday":
                dayoff=0
            case "Monday":
                dayoff=1
                break;
            case "Tuesday":
                dayoff=2
                break;
            case "Wednesday":
                dayoff=3
                break;
            case "Thursday":
                dayoff=4
                break;
            case "Friday":
                dayoff=5
                break;
        }
        for (let i = min; i.getTime() <= max.getTime(); i.setTime(i.getTime()+86400000)) {
            //let ds = new Date()
            //ds.setDate(i);
            if(dayoff==i.getDay())
                continue;
            if(i.getDay()==5)
                continue;
            let fil = att.filter(function(elem){
                return elem.time.getDate()==i.getDate()
            })
            console.log(i.getDate())
            if(fil.length==0)
            missingdays.push(i.getDate())
        }
        res.send(missingdays)

    })
    app.get('/missinghours',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let sum = 0
        let curr = new Date()
        let month = curr.getMonth()
        if(curr.getDate()>10)
        month++
        let max = new Date()
        max.setMonth(month,10)
        max.setHours(19)
        let min = new Date()
        min.setMonth(month-1,11)
        min.setHours(6)
        let att = u.attendance.filter(function(elem){
            let d = elem.time
            return elem.op == "sign out" && d.getTime()>min.getTime() && d.getTime() < max.getTime()
        })
        console.log(min)
        console.log(max)
        console.log(curr)
        att.forEach(element => {
            sum+=element.net
        });
        res.send(sum/60+" Hours")
    })

    function authenticate(req,res,next){
        if(!req.header('auth-token'))
        return res.status(403).send("feen el token ya less")
        blacklist.forEach(element => {
            if(element == req.header('auth-token'))
            return res.status(403).send("You already logged out")
        });
        try{
            jwt.verify(req.header('auth-token'),key)
            next();
        }
        catch(err){
            res.status(403).send("wrong token")
        }
    }
    app.listen(3000,async function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})
//module.exports.app = app
