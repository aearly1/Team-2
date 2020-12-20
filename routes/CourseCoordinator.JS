const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
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
    .get([
        body('courseID').isString().isLength(24).withMessage("courseID must be a string of length 24")
    ],async(req,res)=>{
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
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
            var U = await staffMembers.findOne({_id: requestObject.senderID})
                var sloty= await slot.findOne({_id: requestObject.replacementSlot})
                var requestDisplayed=
                {
                    "request sent by": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                    "Desired slot": sloty,
                }
             if(requestObject.requestType="slot linking")
                 array.push(requestDisplayed);
        }
        res.send(array);
    })
    app.route('/acceptRejectslotLinkingRequest')
    .post([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
    ], [
        body('courseID').isString().isLength(24).withMessage("courseID must be a string of length 24")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
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
           const wantedSlot = await slot.findOne({_id:newRequest.replacementSlot});
         
           if(!wantedSlot.courseTaughtInSlot.equals(courseObject._id))// slot doesnt belong to course
           {
                await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                res.send("Rejected because this is not a slot in course");
           }
           else if(wantedSlot.staffTeachingSlot!=null)//slot is taught by someone else
           {
                await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                res.send("Rejected because some other staff member is already teaching this slot");
           }
           else
           {
               const person = await staffMembers.findOne({_id:newRequest.senderID});
               console.log(person)
                //check if staff have teaching ativity during the slot
                const schedule = person.receivedRequests;
                const busy=false;
                if(schedule!=null)
                 for (const element of schedule) {
                     var slot1= await slot.findOne({_id:element});
                     if(slot1!=null && slot1.startTime==wantedSlot.startTime)
                     {
                        busy =true;break;
                     }  
                }
                if(busy)
                {
                    await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
                    res.send("Rejected because you are already teaching a slt during the same time");
                }
                else{
                    //passed all checks, can accept
                    await staffMembers.findOneAndUpdate({_id :
                        person._id}, {$push: { courses:ObjectId(courseID)}}, {new: true});
                    await request.findOneAndUpdate({_id: ObjectId(requestID)}, {status:"accepted"}, {new: true});
                    await slot.findOneAndUpdate({_id: wantedSlot._id}, {staffTeachingSlot:person._id}, {new: true});
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
        body('courseID').isString().isLength(24).withMessage("courseID must be a string of length 24")
    ],[
        body('startTime').isString().withMessage("startTime must be a string")
    ],[
        body('endTime').isString().withMessage("requestID must be a string")
    ], [
        body('slotLocation').isString().isLength(24).withMessage("slotLocation must be a string of length 24")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
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
    .put([
        body('userID').isString().isLength(24).withMessage("userID must be a string of length 24")
    ],[
        body('courseID').isString().isLength(24).withMessage("courseID must be a string")
    ],[
        body('slotID').isString().isLength(24).withMessage("slotID must be a string")
    ], [
        body('staffTeachingSlot').isString().isLength(24).withMessage("staffTeachingSlot must be a string of length 24")
    ],[
        body('slotLocation').isString().isLength(24).withMessage("slotLocation must be a string of length 24")
    ],async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
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
            var loc = null;
            if(SLOTLOCATION!=null)
            loc=await location.findOne({_id:ObjectId(SLOTLOCATION)});
            var staffToBeAssigned = null;
            if(STAFFTEACHINGSLOT!=null)
            staffToBeAssigned=await staffMembers.findOne({_id:ObjectId(STAFFTEACHINGSLOT)});
            //check that user is a coordinator
            if(courseObject==null)
            {
                res.status(404).send("Course doesn't exist")
            }
            else if(!courseObject.coordinator.equals(user._id))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            else if(STAFFTEACHINGSLOT==null && SLOTLOCATION==null)
            {
                res.status(404).send("Can't update the slot since all slots attributes that could be updated were passed as null");
            }
            else if(SLOTLOCATION!=null &&loc==null)
            {
                res.status(404).send("Location doesnt exist. It might exist in lala land. Who knows?");
            }
            else  if((STAFFTEACHINGSLOT!=null&&staffToBeAssigned==null))
            {
                res.status(404).send("The person that you want to assign this slot to doesn't exist");
            }
           else
           {
               var teachesCourse=false;
               //check if the person you want to assing the slot teaches this course in the first place
               var array=null;
               if(STAFFTEACHINGSLOT!=null)
                array=staffToBeAssigned.courses;
               if(array!=null)
               for (const element of array) {
                if(element==courseObject._id)
                {
                    teachesCourse=true;break;
                }  
                }
            if(!teachesCourse) 
            {
                res.status(401).send("The person that you want to assign this slot to doesn't teach this course");
            }
            else
            {
                 //update person teaching slot
            if(sloteObject.staffTeachingSlot!=null)
            await staffMembers.findOneAndUpdate({_id :
                sloteObject.staffTeachingSlot}, {$pull: { teachingSlots: sloteObject._id}}, {new: true});
            var result=null;
            if(STAFFTEACHINGSLOT==null)
            {
                result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {slotLocation:ObjectId(SLOTLOCATION)}, {new: true})
                    res.send(result);
            }
            else if(SLOTLOCATION==null)
            {
                 result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:ObjectId(STAFFTEACHINGSLOT)}, {new: true})
                    res.send(result);
            }
            else
            {
                result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:ObjectId(STAFFTEACHINGSLOT), slotLocation:ObjectId(SLOTLOCATION)}, {new: true});
                    res.send(result);

            }
            //update person teaching slot
            if(result.staffTeachingSlot!=null)
            {
                await staffMembers.findOneAndUpdate({_id :
                    sloteObject.staffTeachingSlot}, {$push: { teachingSlots: sloteObject._id}}, {new: true});
            }
            }
            }   
        }
        catch(err)
        {
            console.log(err)
        }
    })
    app.route('/deleteCourseSlot')
    .post([
        body('courseID').isString().isLength(24).withMessage("courseID must be a string of length 24")
    ],[
        body('slotID').isString().isLength(24).withMessage("slotID must be a string of length 24")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
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
            if(!courseCoordinated.coordinator.equals(ObjectId(user._id)))
            {
                res.status(401).send("User is not the course coordinator of this course")
            }
            //check that slot exists in course
            const slotToBeDeleted= await slot.findOne({_id:ObjectId(slotID)});
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
                    res.send("Successfully deleted slot")
            }
        }
        catch(err)
        {
            console.log(err);
        }

        
    })
    
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})

module.exports=router;
