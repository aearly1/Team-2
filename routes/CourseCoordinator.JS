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
    .post([
        check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
        check("courseID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
        check("startTime", "Invalid data type. userID must be of type string").isString(),
        check("endTime", "Invalid data type. userID must be of type string").isString(),
        check("slotLocation", "Invalid data type. userID must be of type string").isString().isLength(24)
      ], async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const courseID=req.body.courseID;
        const STARTTIME=req.body.startTime;
        const ENDTIME=req.body.endTime;
        const SLOTLOCATION=req.body.slotLocation;
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
            //perhaps I should do checks on the time?
           //check that slot location exists
           const loc = await location.findOne({_id:ObjectId(SLOTLOCATION)});
           if(loc==null)
           {
               res.status(404).send("Location doesnt exist. It might exist in lala land. Who knows?");
           }
           else
           {
            const newSlot=  new slot(
                {
                    startTime: new Date(STARTTIME), //start time of slot
                    endTime: new Date(ENDTIME), // end time of slot
                    courseTaughtInSlot: ObjectId(courseID), //what course will be taught in the slot 
                    slotLocation: ObjectId(SLOTLOCATION), //ex. H14, C7.301
                }
            );
            newSlot.save();
            await course.findOneAndUpdate({_id :
                ObjectId(courseID)}, {unassignedSlots:courseObject.unassignedSlots+1, $push: { teachingSlots: newSlot._id}}, {new: true})
            res.send(newSlot);
           }
            
            }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/updateCourseSlot')
    .put(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const courseID=req.body.courseID;
        const slotID=req.body.slotID; 
        const STAFFTEACHINGSLOT=req.body.staffTeachingSlot;
        const SLOTLOCATION=req.body.slotLocation;
        try
        {
            //get user
            let user = await staffMembers.findOne({_id:ObjectId(userID)})//fetch supposed coordinator
            let courseObject = await course.findOne({_id:ObjectId(courseID)})//course of coordinator
            let sloteObject = await slot.findOne({_id:ObjectId(slotID)})//course of coordinator

            //check that user is a coordinator
            if(courseObject==null)
            {
                res.status(404).send("Course doesn't exist")
            }
            if(!courseObject.coordinator.equals(user._id))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            //update person teaching slot
            if(sloteObject.staffTeachingSlot!=null)
            await staffMembers.findOneAndUpdate({_id :
                sloteObject.staffTeachingSlot}, {$pull: { teachingSlots: sloteObject._id}}, {new: true});
            if(SLOTLOCATION==null)
            {
                const result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:ObjectId(STAFFTEACHINGSLOT)}, {new: true})
                    res.send(result);
            }
            else
            {
                const result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:ObjectId(STAFFTEACHINGSLOT), slotLocation:ObjectId(SLOTLOCATION)}, {new: true});
                    res.send(result);

            }
            //update person teaching slot
            if(sloteObject.staffTeachingSlot!=null)
            {
                await staffMembers.findOneAndUpdate({_id :
                    sloteObject.staffTeachingSlot}, {$push: { teachingSlots: sloteObject._id}}, {new: true});
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/deleteCourseSlot')
    .post(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //(TO BE CHANGED TO TOKEN)
        const courseID=req.body.courseID; 
        const slotID=req.body.slotID; 
        try
        {
            //get object of supposed coordinator
            const user = await staffMembers.findOne({_id:ObjectId(userID)});
            //get course that our user is supposedly the coordinator of
            const courseCoordinated = await course.findOne({_id:ObjectId(courseID)});
            //check that user is a coordinator and that course exists
            if(courseCoordinated==null)
            {
                res.status(404).send("Course doesn't exist")
            }
            if(!courseCoordinated.coordinator.equals(user._id))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            //check that slot exists in course
            const slotToBeDeleted= await slot.find({_id:ObjectId(slotID)});
            if(slotToBeDeleted==null)
            {
                res.status(404).send("Slot doesnt exist")
            }
            else if(!slotToBeDeleted.courseTaughtInSlot.equals(ObjectId(courseID)))
            {
                res.status(404).send("Slot belongs to another course")
            }
            else{
                //remove it from schedules
                await staffMembers.findOneAndUpdate(
                    {_id:slotToBeDeleted.staffTeachingSlot},
                    { $pull: { scheduleSlots: ObjectId(slotToBeDeleted._id) } },
                    { multi: true }
                )
                //passed all checks delete slot
                const result= await slot.deleteOne({_id :
                    slotToBeDeleted._id})
                    res.send(result)
            }
        }
        catch(err)
        {
            console.log(err);
        }

        
    })
    async function trial()
    {
        var ObjectId = require('mongodb').ObjectId; 

       const newLoc = new location(
        {
            roomNr: "H14",
            roomType: "lecture hall", //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
       );
       newLoc.save();
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
