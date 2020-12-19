const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");
const router = express.Router();
const course = require('../models/course');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');
mongoose.connect('mongodb://aearly:aemongo99@peacluster-shard-00-00.zwo5a.mongodb.net:27017,peacluster-shard-00-01.zwo5a.mongodb.net:27017,peacluster-shard-00-02.zwo5a.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-zvq7do-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(async()=>{
    const app= express();
    app.use(express.json());
    app.route('/schedule')
    .get(async(req,res)=>
        {
            var ObjectId = require('mongodb').ObjectId; 
            const userID=req.body.userID; //get id of requeSter from request body (TO BE CHANGED TO TOKEN)
            
            //get user object
            const user= await staffMembers.findOne({_id:ObjectId(userID)});
            const slotsArray=user.scheduleSlots;
            const schedule=[];

            if(user.type=="HR")
            {
                res.status(401).send("User is not an academic staff member")
            }
            
            if(slotsArray!=null)
            for (const element of slotsArray) {
                const slot1= await slot.findOne({_id:element});
                schedule.push(slot1);
               }
            res.send(schedule);
        }
    )
   app.route('/replacementRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const senderID=req.body.senderID; //get id of requeSter from request body (TO BE CHANGED TO TOKEN)
        const recieverID=req.body.recieverID;//get id of reciever from request body
        const slotID=req.body.slotID;
        //get sender object
        const senderObject= await staffMembers.findOne({_id:ObjectId(senderID)});
        //get reciever object
        const recieverObject= await staffMembers.findOne({_id:ObjectId(recieverID)});
        console.log(senderObject.type);
        if(recieverObject!=null && senderObject!=null)//check if users exist
        {
            //check that user is not HR
            if(senderObject.type=="HR")
            {
            res.status(401).send("User is not an academic staff member")
            }
            //check if they are in the same department
            if(senderObject.facultyName!=recieverObject.facultyName)
            {
                res.status(404).send("This staff member is not in the same department as you. Therefore, you can't send this replacement request")
            }
            else //check if they are in the same course
            {
                const slotObject= await slot.findOne({_id:ObjectId(slotID)});
                var sameCourse=false;
                for (const element of recieverObject.courses) {
                    var courseObject= await course.findOne({_id:element});
                        sameCourse=courseObject.courseName==slotObject.courseTaughtInSlot?true:sameCourse;
                   }
               

                if(!sameCourse)
                {
                    res.status(404).send("This staff member is not in the same course as you. Therefore, you can't send this replacement request")
                }
                else{
                    //we are done with the verifications, we can create and send the request
                    //create request
                    const newRequest= new request(
                    {
                        senderID: new ObjectId(senderID), //id of the staff member sending the request
                        recieverID: new ObjectId(recieverID), //id of the staff member recieving the request
                        requestType: "Replacement", //the available request types are change day off OR slot linking OR leave OR replacement)
                        status: "Pending", //the value of status can either be accepted or rejected or pending
                        replacementSlot: ObjectId(slotID)
                    }
                    );
                   await staffMembers.findOneAndUpdate({_id :
                        ObjectId(senderID)},  { $push: { sentRequests: newRequest._id }}, {new: true});
                    await staffMembers.findOneAndUpdate({_id :
                        ObjectId(recieverID)},  { $push: { receivedRequests: newRequest._id }}, {new: true});
                   //save request in DB
                    try
                    {
                        const result = await newRequest.save();
                        res.send(result);
                    }
                    catch(err)
                    {
                        console.log(err);
                    }
                 }
            }
        }
        else
        {
            res.status(404).send("User not found");
        }
    })
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        let array=[];
       if(userObject.receivedRequests!=null)
        for (const element of userObject.receivedRequests) {
            var requestObject= await request.findOne({_id:element});
                if(requestObject.requestType=="replacement")requestObject.push(requestObject);
           }
        res.send(array);
    })
    app.route('/acceptReplacementRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const requestID=req.body.requestID;// id of request that you want to accept

        //get user
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
        //get request
        const newRequest= await request.findOne({_id:ObjectId(requestID)});
        console.log(newRequest)
        //check that user is not HR
        if(user.type=="HR")
        {
        res.status(401).send("User is not an academic staff member")
        }
        if(newRequest==null)
        {
            res.status(404).send("Request doesn't exist")
        }
        if(!user || !newRequest.recieverID.equals(user._id))
        {
            res.status(401).send("You cannot accept someone elses request");
        }
        if(newRequest.requestType!="replacement")
        {
            res.status(401).send("This is not a replacement request in the first place")
        }
        if(newRequest.status!="pending")
        {
            res.status(401).send("You can only accept pending requests")
        }
        //passed all these checks then accept request
        try
        {
            await request.findOneAndUpdate({_id: requestID}, {status:"accepted"}, {new: true});
            res.send("Accepted")
        }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/rejectReplacementRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const requestID=req.body.requestID;// id of request that you want to reject

        //get user
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
        //get request
        const newRequest= await request.findOne({_id:ObjectId(requestID)});
        if(user.type=="HR")
        {
        res.status(401).send("User is not an academic staff member")
        }
        if(newRequest==null)
        {
            res.status(404).send("Request doesn't exist")
        }
        if(!user || !newRequest.recieverID.equals(user._id))
        {
            res.status(401).send("You cannot reject someone elses request");
        }
        if(newRequest.requestType!="replacement")
        {
            res.status(401).send("This is not a replacement request in the first place")
        }
        if(newRequest.status!="pending")
        {
            res.status(401).send("You can only reject pending requests")
        }
        //passed all these checks then reject request
        try
        {
            await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
            res.send("Rejected")
        }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/slotLinkingRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const slotID=req.body.slotID;// id of slot that you want to teach
        //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
        //get the object of the desired slot
        const desiredSlot= await slot.findOne({_id:ObjectId(slotID)});
        const slotCourse = await course.findOne({courseName: desiredSlot.courseTaughtInSlot})//get the course in order to know the course coordinator
        //create request
        const newRequest = new request(
            {
                senderID: ObjectId(userID), //id of the staff member sending the request
                recieverID: slotCourse.coordinator, //id of the staff member recieving the request
                requestType: "slot linking", //the available request types are change day off OR slot linking OR leave OR replacement)
                status: "pending", //the value of status can either be accepted or rejected or pending
                replacementSlot: ObjectId(slotID), //id of slot for replacement request
            }
        );
        try{
            newRequest.save();
            await staffMembers.findOneAndUpdate({_id :ObjectId(userID)}, { $push: { sentRequests: newRequest._id }}, {new: true});
            await staffMembers.findOneAndUpdate({_id :slotCourse.coordinator}, { $push: { receivedRequests: newRequest._id }}, {new: true});
            res.send(newRequest);
        }
        catch(err)
        {
            console.log(err);
        }
        
    })
    app.route('/changeDayOffRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the change day off request from request body (TO BE CHANGED TO TOKEN)
        const reasonForChange=req.body.reason;// id of slot that you want to teach
        //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
        //get department of user
        const departmentName=user.departmentName;
        if(departmentName==null)
        {
            res.status(404).send("user is not in a department/ Thus, there is not HOD of department to send this request to")
        }
        //get the object of the department
        const departmentObj= await department.findOne({departmentName:departmentName});
        //create request
        var newRequest=null;
        if(reasonForChange!=null)
        {
            newRequest = new request(
                {
                    senderID: ObjectId(userID), //id of the staff member sending the request
                    recieverID: departmentObj.HOD_id, //id of the staff member recieving the request
                    requestType: "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                    status: "pending", //the value of status can either be accepted or rejected or pending
                    requestReason: reasonForChange
                }
            );
        }
        else
        {
            newRequest = new request(
                {
                    senderID: ObjectId(userID), //id of the staff member sending the request
                    recieverID: departmentObj.HOD_id, //id of the staff member recieving the request
                    requestType: "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                    status: "pending", //the value of status can either be accepted or rejected or pending
                }
            );
        }
        try{
            newRequest.save();
            await staffMembers.findOneAndUpdate({_id :ObjectId(userID)}, { $push: { sentRequests: newRequest._id }}, {new: true});
            await staffMembers.findOneAndUpdate({_id :departmentObj.HOD_id}, { $push: { receivedRequests: newRequest._id }}, {new: true});
            res.send(newRequest);
        }
        catch(err)
        {
            console.log(err);
        }
    })
    app.route('/changeDayOffRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const senderID=req.body.senderID; //get id of requeSter from request body (TO BE CHANGED TO TOKEN)
        const recieverID=req.body.recieverID;//get id of reciever from request body
        const slotID=req.body.slotID;
        //get sender object
        const senderObject= await staffMembers.findOne({_id:ObjectId(senderID)});
        //get reciever object
        const recieverObject= await staffMembers.findOne({_id:ObjectId(recieverID)});
        console.log(senderObject.type);
        if(recieverObject!=null && senderObject!=null)//check if users exist
        {
            //check that user is not HR
            if(senderObject.type=="HR")
            {
            res.status(401).send("User is not an academic staff member")
            }
            //check if they are in the same department
            if(senderObject.facultyName!=recieverObject.facultyName)
            {
                res.status(404).send("This staff member is not in the same department as you. Therefore, you can't send this replacement request")
            }
            else //check if they are in the same course
            {
                const slotObject= await slot.findOne({_id:ObjectId(slotID)});
                var sameCourse=false;
                for (const element of recieverObject.courses) {
                    var courseObject= await course.findOne({_id:element});
                        sameCourse=courseObject.courseName==slotObject.courseTaughtInSlot?true:sameCourse;
                   }
               

                if(!sameCourse)
                {
                    res.status(404).send("This staff member is not in the same course as you. Therefore, you can't send this replacement request")
                }
                else{
                    //we are done with the verifications, we can create and send the request
                    //create request
                    const newRequest= new request(
                    {
                        senderID: new ObjectId(senderID), //id of the staff member sending the request
                        recieverID: new ObjectId(recieverID), //id of the staff member recieving the request
                        requestType: "Replacement", //the available request types are change day off OR slot linking OR leave OR replacement)
                        status: "Pending", //the value of status can either be accepted or rejected or pending
                        replacementSlot: ObjectId(slotID)
                    }
                    );
                   await staffMembers.findOneAndUpdate({_id :
                        ObjectId(senderID)},  { $push: { sentRequests: newRequest._id }}, {new: true});
                    await staffMembers.findOneAndUpdate({_id :
                        ObjectId(recieverID)},  { $push: { courses: newRequest._id }}, {new: true});
                   //save request in DB
                    try
                    {
                        const result = await newRequest.save();
                        res.send(result);
                    }
                    catch(err)
                    {
                        console.log(err);
                    }
                 }
            }
        }
        else
        {
            res.status(404).send("User not found");
        }
    })
    app.route('/requestStatus')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
             var requestObject= await request.findOne({_id:element});
                 array.push(requestObject);
        }
        res.send(array);
    })
    app.route('/requestStaus/accepted')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
             var requestObject= await request.findOne({_id:element});
             if(requestObject.status="accepted")
                 array.push(requestObject);
        }
        res.send(array);
    })
    app.route('/requestStaus/rejected')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
            if(requestObject.status="rejected")
                array.push(requestObject);
        }
        res.send(array);
    })
    app.route('/requestStaus/pending')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
            if(requestObject.status="pending")
            array.push(requestObject);
        }
        res.send(array);
    })
    app.route('/cancleRequest')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        const requestID=req.body.requestID;// id of the request that we want to cancel
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})//object of the user wanting to cancel the request
        if(userObject.type=="HR")//if he is an HR staff member then this route is not for him
        {
            res.status(401).send("User is not an academic staff member")
        }

        const requestObject = await request.findOne({_id:ObjectId(requestID)});// reuest that he wants to cancle
        if(requestObject==null)//request doesn't exist
        {
            res.status(404).send("Request not found");
        }
        //check if he is the one who sent the request
        if(requestObject.senderID!=userObject._id)
        {
            res.status(401).send("You are not authorized to cancel this request since you are not the sender");
        }
        //check if the request is still pending
        if(requestObject.status!="Pending")
        {
            res.status(401).send("You are not authorized to cancel this request since it is no longer pending");
        }
        //since it passed all checks, remove it from both the sender and reciever
        //removed it from sender
        await staffMembers.findOneAndUpdate(
            {_id:requestObject.senderID},
            { $pull: { sentRequests: ObjectId(requestID) } },
            { multi: true }
        )
        await staffMembers.findOneAndUpdate(
            {_id:requestObject.recieverID},
            { $pull: { receivedRequests: ObjectId(requestID) } },
            { multi: true }
        )
        res.send(requestObject);
    })
    async function funct()
    {
        var ObjectId = require('mongodb').ObjectId; 
        const user1= await staffMembers.findOne({_id: ObjectId("5fdde841c77a572248510f5b")});
        console.log(user1.name);
        console.log(user1.sentRequests);
        const user2= await staffMembers.findOne({_id: ObjectId("5fdde841c77a572248510f5c")});
        console.log(user2.name);
        console.log(user2.receivedRequests);
    }
   //funct();
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})

module.exports=router;
