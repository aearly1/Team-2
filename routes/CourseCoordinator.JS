const express = require('express');
const mongoose = require('mongoose');
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
    app.route('/slotLinkingRequest')
    .get(async(req,res)=>{
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        const courseID=req.body.courseID;
        let userObject = await staffMembers.findOne({_id:ObjectId(userID)})//fetch supposed coordinator
        let courseObject = await course.findOne({_id:ObjectId(courseID)})//course of coordinator
        if(courseObject==null)
        {
            res.status(404).send("Course doesn't exist")
        }
        if(!courseObject.coordinator.equals(userObject._id))
        {
            res.status(401).send("User is not the course coordinator of this course")
        }
        const requetsRec = userObject.receivedRequests;
        let array=[];
        if(requetsRec!=null)
         for (const element of requetsRec) {
             var requestObject= await request.findOne({_id:element});
             if(requestObject.requestType="slot linking")
                 array.push(requestObject);
        }
        res.send(array);
    })
    app.route('/acceptRejectslotLinkingRequest')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const requestID=req.body.requestID;// id of request that you want to accept
        const courseID=req.body.courseID;

        try
        {
            //get user
            let user = await staffMembers.findOne({_id:ObjectId(userID)})//fetch supposed coordinator
            let courseObject = await course.findOne({_id:ObjectId(courseID)})//course of coordinator
            //get request
            const newRequest= await request.findOne({_id:ObjectId(requestID)});

            //check that user is a coordinator
            if(courseObject==null)
            {
                res.status(404).send("Course doesn't exist")
            }
            if(!courseObject.coordinator.equals(user._id))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            if(newRequest==null)
            {
                res.status(404).send("Request doesn't exist")
            }
            if(!user || !newRequest.recieverID.equals(user._id))
            {
                res.status(401).send("You cannot accept/reject someone elses request");
            }
            if(newRequest.requestType!="slot linking")
            {
                res.status(401).send("This is not a slot linking request in the first place")
            }
            if(newRequest.status!="pending")
            {
                res.status(401).send("You can only accept/reject pending requests")
            }
            //passed all these checks then accept or reject request request
           const wantedSlot = await slot.find({_id:newRequest.replacementSlot});
           if(wantedSlot.courseTaughtInSlot!=courseObject.courseName)// slot doesnt belong to course
           {
                await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                res.send("rejected");
           }
           else if(wantedSlot.staffTeachingSlot!=null)//slot is taught by someone else
           {
                await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                res.send("rejected");
           }
           else
           {
                //check if staff have teaching ativity during the slot
                const schedule = userObject.receivedRequests;
                const busy=false;
                if(schedule!=null)
                 for (const element of schedule) {
                     var slot1= await slot.findOne({_id:element});
                     if(slot1.startTime==wantedSlot.startTime)
                     {
                        busy -true;break;
                     }  
                }
                if(busy)
                {
                    await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                    res.send("rejected");
                }
                else{
                    //passed all checks, can accept
                    await request.findOneAndUpdate({_id: ObjectId(requestID)}, {status:"accepted"}, {new: true});
                    await slot.findOneAndUpdate({_id: wantedSlot._id}, {staffTeachingSlot:user.name}, {new: true});
                    await course.findOneAndUpdate({_id:ObjectId(courseID)}, {unassignedSlots:courseObject.unassignedSlots-1}, {new: true});
                    res.send("accepted");
                }
           }
        }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/addCourseSlot')
    .post((req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const courseID=req.body.courseID;
        try
        {
            //get user
            let user = await staffMembers.findOne({_id:ObjectId(userID)})//fetch supposed coordinator
            let courseObject = await course.findOne({_id:ObjectId(courseID)})//course of coordinator

            //check that user is a coordinator
            if(courseObject==null)
            {
                res.status(404).send("Course doesn't exist")
            }
            if(!courseObject.coordinator.equals(user._id))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            const newSlot=  new slot(
                {
                    startTime: req.body.startTime, //start time of slot
                    endTime: req.body.endTime, // end time of slot
                    courseTaughtInSlot: ObjectId(courseID), //what course will be taught in the slot 
                    staffTeachingSlot: mongoose.Types.ObjectId,// null if this slot is still not assigned to anyone
                    slotLocation: {type: mongoose.Types.ObjectId, required: true}, //ex. H14, C7.301
                    replacementStaff: mongoose.Types.ObjectId //if another staff member will replace a staff member on leave
                }
            );
        }
        catch(err)
        {
            console.log(err)
        }
    })
    async function trial()
    {
        var ObjectId = require('mongodb').ObjectId; 

        await staffMembers.findOneAndUpdate({_id :
            ObjectId("5fdde841c77a572248510f5c")},  { $push: { receivedRequests: ObjectId("5fddea993ca9aa1e9c41d2bd")}}, {new: true});
    }
    //trial();
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})

module.exports=router;
