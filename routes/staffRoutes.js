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
        
    })
    app.put('/passwordreset',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let oldpass = req.body.oldpassword
        let newpass = req.body.newpassword
        const verified = await bcrypt.compare(oldpass,u.password)
        if(!verified)
        return res.status(403).send("wrong pass")
        const salt = await bcrypt.genSalt(12)
        const hashedPassword =await bcrypt.hash(newpass,salt)
        u.password = hashedPassword
        staffMembers.deleteOne({email:payload.email})
        u.save()
        res.status(200).send("Password Changed")
    })

    app.post('/signin',async(req,res)=>{        
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let lastop = u.attendance.pop()
        if(lastop.op == "sign out")
        u.attendance.push(lastop)
        u.attendance.push({op:"sign in", time: dateTime})
        res.status(200).send(u.attendance)
        staffMembers.deleteOne({email:payload.email})
        u.save()
        
    })

    app.post('/signout',async(req,res)=>{        
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        let lastop = u.attendance.pop()
        u.attendance.push(lastop)
        if(lastop.op == "sign in"){
        u.attendance.push({op:"sign out", time: dateTime})
        res.status(200).send(u.attendance)
        staffMembers.deleteOne({email:payload.email})
        u.save()
        }
        else
        res.status(401).send("cannot sign out before signing in")
    })
    app.get('/attendance/:month',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        console.log(u.attendance)
           let out = []
            for (let index = 0; index < u.attendance.length; index++) {
                let d =u.attendance[index].time.split("-")
                console.log(d)
                if(d[1] == req.params.month)
                out.push(u.attendance[index]);
            }
            res.status(200).send(out)
        
    })

    app.get('/attendance',async(req,res)=>{
        const payload = jwt.verify(req.header('auth-token'),key);
        let u = await staffMembers.findOne({email:payload.email});
        res.status(200).send(u.attendance)
        
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
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})
//module.exports.app = app