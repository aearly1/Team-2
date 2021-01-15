const express = require('express');
const jwt = require("jsonwebtoken");
const key='shaka'
//const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const course = require('../models/course');
//const department= require('../models/department.js');
//const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');

router.route('/theSlots')
    .get(async(req,res)=>{

        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        let userObject = await staffMembers.findOne({_id:userID})//fetch supposed coordinator
        const courseList = await course.find();

        courseId=null;
        if(courseList!=null)
        for (const element of courseList) 
        {
            if(element.coordinator.equals(userID))
            {
                courseId=element._id;break;
            }
        }
        if(courseId==null)
        {
            res.status(404).send("Not coordinator")
        }
        else
        {
            const c= await course.findOne({_id:courseId})
            const locs= await location.find();
            const array=[];
            for (const element of locs) {
                array.push(element.roomNr);
            }
            const staffIDs=c.instructors.concat(c.teachingAssistants);
            const staffNames=[]
            if(staffIDs!=null)
           for (const element of staffIDs) 
            {
               const person=await staffMembers.findOne({_id:element});

               staffNames.push(person.name);
            }
            const results=[];
            const theslots=c.teachingSlots;
           if(theslots!=null)
           for (const element of theslots) 
            {
                var sloto=await slot.findOne(element);
                var dayNr=sloto.day;
                var DAYO="";
                if(dayNr==1)
                {
                    DAYO="SAT"
                }
                else if(dayNr==2)
                {
                    DAYO="SUN"
                }
                else if(dayNr==3)
                {
                    DAYO="MON"
                }
                else if(dayNr==4)
                {
                    DAYO="TUES"
                }
                else if(dayNr==5)
                {
                    DAYO="WED"
                }
                else if(dayNr==6)
                {
                    DAYO="THURS"
                }
                else
                {
                    DAYO="FRI"
                }
                var object=
                {
                    id: sloto._id,
                    Day: DAYO,
                    startTime: sloto.startTime.toLocaleTimeString(), 
                    endTime: sloto.endTime.toLocaleTimeString(), 
                    taughtBy: staffNames, 
                    location: array,
                }
                results.push(object);
            }
            res.send(results)
        }
    })
router.route('/slotLinkingRequest')
    .get(async(req,res)=>{
        const userID=req.user.objectId;
        let userObject = await staffMembers.findOne({_id:userID})//fetch supposed coordinator
        const courseList = await course.find();
        courseId=null;
        if(courseList!=null)
        for (const element of courseList) 
        {
            if(element.coordinator.equals(userID))
            {
                courseId=element._id;break;
            }
        }
        let array=[];
        if(courseId!=null)
        {
        const courseObject= await course.findOne({_id:courseId})
        const requetsRec = userObject.receivedRequests;
        if(requetsRec!=null)
         for (const element of requetsRec) {
             var requestObject= await request.findOne({_id:element});
            var U = await staffMembers.findOne({_id: requestObject.senderID})
                var sloty= await slot.findOne({_id: requestObject.replacementSlot})
                var loc = await location.findOne({_id: sloty.slotLocation})
                var desiredS=
                {
                    "startTime": sloty.startTime.toLocaleTimeString().substring(3),
                    "endTime": sloty.endTime.toLocaleTimeString().substring(3),
                    "courseTaughtInSlot": courseObject.courseName,
                    "slotLocation": loc.roomNr
                }
                var requestDisplayed=
                {
                    "id": requestObject._id,
                    "Sender": U.name, 
                    "Reciever": userObject.name,
                    "RequestType": requestObject.requestType,
                    "Status": requestObject.status,
                    "DesiredSlot": desiredS,
                }
             if(requestObject.requestType=="slot linking")
             {
                array.push(requestDisplayed);
             }
        }

        res.send(array);
    }
    })
    router.route('/acceptRejectslotLinkingRequest')
    .post([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
    ], [
        body('coursename').isString().withMessage("coursename must be a string")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        const requestID=req.body.requestID;// id of request that you want to accept
        const coursename=req.body.coursename;

        try
        {
            //get user
            let user = await staffMembers.findOne({_id:userID})//fetch supposed coordinator

            let courseObject = await course.findOne({courseName:coursename})//course of coordinator

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
                        person._id}, {$push: { courses:courseObject.courseName}}, {new: true});
                    await request.findOneAndUpdate({_id: ObjectId(requestID)}, {status:"accepted"}, {new: true});
                    await slot.findOneAndUpdate({_id: wantedSlot._id}, {staffTeachingSlot:person._id}, {new: true});
                    await course.findOneAndUpdate({_id:courseObject._id}, {unassignedSlots:courseObject.unassignedSlots-1}, {new: true});
                    res.send("accepted");
                }
           }
        }
        catch(err)
        {
            console.log(err)
        }
    })
    router.route('/addCourseSlot')
    .post([
        body('day').isString().withMessage("day must be a string")
    ],[
        body('slotNr').isString().withMessage("slotNr must be a numeric")
    ], [
        body('slotLocation').isString().withMessage("slotLocation must be a string")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 
        const userID=req.user.objectId;        
        const day=req.body.day;
        const slotoNr=req.body.slotNr;
        const SLOTLOCATION=req.body.slotLocation;

        var startTimo=null;
        var endTimo=null
                if(slotoNr=="1st")
                {
                    startTimo="2020-12-20T10:08:15.000Z";
                    endTimo="2020-12-20T10:09:45.000Z";
                }
                else if(slotoNr=="2nd")
                {
                    startTimo="2020-12-20T10:10:00.000Z";
                    endTimo="2020-12-20T10:11:30.000Z";
                }
                else if(slotoNr=="3rd")
                {
                    startTimo="2020-12-20T10:11:45.000Z";
                    endTimo="2020-12-20T10:13:15.000Z";
                }
                else if(slotoNr=="4th")
                {
                    startTimo="2020-12-20T10:13:45.000Z";
                    endTimo="2020-12-20T10:15:15.000Z";
                }
                else if(slotoNr=="5th")
                {
                    startTimo="2020-12-20T10:15:45.000Z";
                    endTimo="2020-12-20T10:17:15.000Z";
                }
                var dayNr=0;
                if(day=="Sataurday")
                {
                    dayNr=1;
                }
                else if(day=="Sunday")
                {
                    dayNr=2;
                }
                else if(day=="Monday")
                {
                    dayNr=3;
                }
                else if(day=="Tuesday")
                {
                    dayNr=4;
                }
                else if(day=="Wednesday")
                {
                    dayNr=5;
                }
                else if(day=="Thursday")
                {
                    dayNr=6;
                }
                else
                {
                    dayNr=7;
                }
        try
        {
            //get user
            let user = await staffMembers.findOne({_id:userID})//fetch supposed coordinator

            const courseList = await course.find();

            courseId=null;
            if(courseList!=null)
            for (const element of courseList) 
            {
                if(element.coordinator.equals(userID))
                {
                    courseId=element._id;break;
                }
            }
            if(courseId==null)
            {
                res.status(404).send("Not coordinator")
            }
            else
            {
                //perhaps I should do checks on the time?
                //check that slot location exists
                const c= await course.findOne({_id:courseId})
                const loc = await location.findOne({roomNr:SLOTLOCATION});
                if(loc==null)
                {
                    res.status(404).send("Location doesnt exist. It might exist in lala land. Who knows?");
                }
                else
                {
                    const newSlot=  new slot(
                        {
                            slotNr:slotoNr,
                            day: dayNr,
                            startTime: new Date(startTimo), //start time of slot
                            endTime: new Date(endTimo), // end time of slot
                            courseTaughtInSlot: c._id, //what course will be taught in the slot 
                            slotLocation: loc._id, //ex. H14, C7.301
                        }
                    );
                    await newSlot.save();
                    await course.findOneAndUpdate({_id :
                        c._id}, {unassignedSlots:c.unassignedSlots+1, $push: { teachingSlots: newSlot._id}}, {new: true})
                    
                    var result=
                    {
                        "slotNr":slotoNr,
                        "day": dayNr,
                        "startTime": newSlot.startTime,
                        "endTime": newSlot.endTime,
                        "courseTaughtInSlot": c.courseName,
                        "slotLocation": loc.roomNr
                    }

                    res.send(result);
                }
                }    
                }
                catch(err)
                {
                    console.log(err)
                }
    })
    router.route('/updateCourseSlot')
    .put([
        body('slotID').isString().isLength(24).withMessage("slotID must be a string")
    ],[
        body('staffTeachingSlot').isString().optional().withMessage("staffTeachingSlot must be a string")
    ],[
        body('slotLocation').isString().optional().withMessage("slotLocation must be a string")
    ], async(req,res)=>
    {

        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        const slotID=req.body.slotID; 
        const STAFFTEACHINGSLOT=req.body.staffTeachingSlot;
        const SLOTLOCATION=req.body.slotLocation;
        try
        {
            let sloteObject = await slot.findOne({_id:ObjectId(slotID)});//course of coordinator
            var loc = null;
            if(SLOTLOCATION!=null)
            loc=await location.findOne({roomNr:SLOTLOCATION});
            var staffToBeAssigned = null;
            if(STAFFTEACHINGSLOT!=null)
            staffToBeAssigned=await staffMembers.findOne({name:STAFFTEACHINGSLOT});
            const courseList = await course.find();

            courseId=null;
            if(courseList!=null)
            for (const element of courseList) 
            {
                if(element.coordinator.equals(userID))
                {
                    courseId=element._id;break;
                }
            }
            if(courseId==null)
            {
                res.status(404).send("Not coordinator")
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
                const courseObject= await course.findOne({_id:courseId})

               var teachesCourse=false;
               //check if the person you want to assing the slot teaches this course in the first place
               var array=null;
               if(STAFFTEACHINGSLOT!=null)
                array=staffToBeAssigned.courses;
               if(array!=null)
               for (const element of array) 
               {
                    if(element==courseObject.courseName)
                    {
                        teachesCourse=true;break;
                    }  
                }
                if(STAFFTEACHINGSLOT==null)teachesCourse=true
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
                    ObjectId(slotID)}, {slotLocation:loc._id}, {new: true})
                    const slotInfo=
                    {
                        "startTime": result.startTime,
                        "endTime": result.endTime,
                        "courseTaughtInSlot": courseObject.courseName,
                        "staffTeachingSlot": "N/A",
                        "slotLocation": loc.roomNr
                    }
                    res.send(slotInfo);
            }
            else if(SLOTLOCATION==null)
            {
                 result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:staffToBeAssigned._id}, {new: true})
                    const slotInfo=
                    {
                        "startTime": result.startTime,
                        "endTime": result.endTime,
                        "courseTaughtInSlot": courseObject.courseName,
                        "staffTeachingSlot": staffToBeAssigned.name,
                        "slotLocation": "N/A"
                    }
                    res.send(slotInfo);
            }
            else
            {
                result=await slot.findOneAndUpdate({_id :
                    ObjectId(slotID)}, {staffTeachingSlot:ObjectId(staffToBeAssigned._id), slotLocation:loc._id}, {new: true});
                    const slotInfo=
                    {
                        "startTime": result.startTime,
                        "endTime": result.endTime,
                        "courseTaughtInSlot": courseObject.courseName,
                        "staffTeachingSlot": staffToBeAssigned.name,
                        "slotLocation": loc.roomNr
                    }
                    res.send(slotInfo);

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
    router.route('/deleteCourseSlot')
    .post([
        body('slotID').isString().withMessage("slotID must be a string")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 
        const userID=req.user.objectId;
        const coursename=req.body.courseName; 

        const slotID=req.body.slotID; 
        try
        {
            //get object of supposed coordinator
            let user = await staffMembers.findOne({_id:userID})//fetch supposed coordinator

            const courseList = await course.find();

            courseId=null;
            if(courseList!=null)
            for (const element of courseList) 
            {
                if(element.coordinator.equals(userID))
                {
                    courseId=element._id;break;
                }
            }
            if(courseId==null)
            {
                res.status(404).send("Not coordinator")
            }
            else
            {
                //perhaps I should do checks on the time?
                //check that slot location exists
                const courseCoordinated= await course.findOne({_id:courseId})
            //check that slot exists in course
            const slotToBeDeleted= await slot.findOne({_id:ObjectId(slotID)});
            if(slotToBeDeleted==null)
            {
                res.status(404).send("Slot doesnt exist")
            }
            else if(!slotToBeDeleted.courseTaughtInSlot.equals(courseCoordinated._id))
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
                await course.findOneAndUpdate(
                    {_id:courseCoordinated._id},
                    { $pull: { teachingSlots: ObjectId(slotToBeDeleted._id) } },
                    { multi: true }
                )
                //passed all checks delete slot

                const result= await slot.deleteOne({_id :
                    slotToBeDeleted._id})
                    res.send("Successfully deleted slot")
            }
        }
        }
        catch(err)
        {
            console.log(err);
        }    
    })

module.exports=router;
