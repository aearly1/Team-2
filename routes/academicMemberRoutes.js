const express = require('express');
//const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const course = require('../models/course');
const department= require('../models/department.js');
//const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');

router.route('/recievedRequests')
.get(async(req,res)=>
{
    var ObjectId = require('mongodb').ObjectId; 
    const userID=req.user.objectId;
    try{
       const me= await staffMembers.findOne({_id:userID});
       const recRequests=me.receivedRequests; 
       const result=[]

       //replacement request
        let userObject = await staffMembers.findOne({_id:userID})
       if(userObject.receivedRequests!=null)
       {
        for (const element of userObject.receivedRequests) {
            var requestObject= await request.findOne({_id:element});
            if(requestObject.requestType=="replacement"){
                var U = await staffMembers.findOne({_id: requestObject.senderID})
                var sloty= await slot.findOne({_id: requestObject.replacementSlot})
                const courseObject=await course.findOne({_id:sloty.courseTaughtInSlot});
                const loc=await location.findOne({_id:sloty.slotLocation});
                const staff=await staffMembers.findOne({_id:sloty.staffTeachingSlot});
                   const S = 
                   {
                    "StartTime": sloty.startTime.toLocaleTimeString().substring(3),
                    "EndTime": sloty.endTime.toLocaleTimeString().substring(3),
                    "CourseTaughtInSlot": courseObject.courseName,
                    "staff member teaching slot": staff.name,
                    "SlotLocation": loc.roomNr
                    }
                var requestDisplayed=
                {
                    "id": requestObject._id,
                    "Sender": U.name, 
                    "Reciever": userObject.name,
                    "RequestType": requestObject.requestType,
                    "Status": requestObject.status,
                    "ReplacementSlot": S,
                }
                result.push(requestDisplayed);
            }
        }
        }

        //slot linking
        const courseList = await course.find();
        console.log(courseList);
        courseId=null;
        if(courseList!=null)
        for (const element of courseList) 
        {
            console.log(element.coordinator);
            if(element.coordinator!=null && element.coordinator.equals(userID))
            {
                courseId=element._id;break;
            }
        }
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
                result.push(requestDisplayed);
             }
        }
        }

        //diab
       if(recRequests!=null)
       for(const element of recRequests)
       {
            const aRequest= await request.findOne({_id: element});
            const sender = await staffMembers.findOne({_id:aRequest.senderID})
            if(aRequest.requestType=="change day off")
            {
                const request =
                {
                        "id": aRequest._id,
                        "Sender": sender.name, //id of the staff member sending the request
                        "Reciever": me.name, //id of the staff member recieving the request
                        "RequestType": "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                        "DesiredDayOff" :aRequest.DesiredDayOff,
                        "Status": aRequest.status, //the value of status can either be accepted or rejected or pending
                        "Reason": aRequest.requestReason
                }
                result.push(request)
            }
            else if(aRequest.requestType!="replacement" && aRequest.requestType!="slot linking")
            {
                const request=
                {
                    "id": aRequest._id,
                    "Status": aRequest.status,
                    "Sender":sender.name,
                    "Reciever":me.name,
                    "RequestType":aRequest.requestType,
                    "ReplacementStaffName":aRequest.replacementStaffName, 
                    "RelaventLeaveDocuments":aRequest.relaventLeaveDocuments, 
                    "Reason":aRequest.requestReason,
                    "StartOfLeave":aRequest.startOfLeave,
                    "EndOfLeave":aRequest.endOfLeave
                }
                result.push(request)
            }
       }
       res.send(result);
    }
    catch(err){
        console.log(err)
    }
})

router.route('/unassignedslots')
.get(async(req,res)=>
{
    var ObjectId = require('mongodb').ObjectId; 
    const userID=req.user.objectId;
    try{
       const me= await staffMembers.findOne({_id:userID});
       const myCourses=me.courses; 
       const result=[];
       if(myCourses!=null)
       {
        for (const element of myCourses) {
            const theCourse= await course.findOne({courseName:element});
            const theSlots= theCourse.teachingSlots;
            if(theSlots!=null)
            for (const element2 of theSlots) {
                const sloto = await slot.findOne({_id:element2});
                try{
                    if(sloto.staffTeachingSlot!=null)
                    {
                    }
                    else
                    {
                        const LOCO= await location.findOne({_id: sloto.slotLocation})
                        const info=
                    {
                        id: sloto._id,
                        day: sloto.day,
                        slotNr: sloto.slotNr,
                        location: LOCO.roomNr,
                        course: theCourse.courseName
                    }
                    result.push(info);
                    }
                }
                catch(err)
                {
                    const info=
                    {
                        id: sloto._id,
                        day: sloto.day,
                        slotNr: sloto.slotNr,
                        location: sloto.location,
                        course: theCourse.courseName
                    }
                    result.push(info);
                }
            }
        }
       }  
       res.send(result); 
    }
    catch(err){
        console.log(err)
    }
})

router.route('/mySlots')
.get(async(req,res)=>
{
    var ObjectId = require('mongodb').ObjectId; 
    const userID=req.user.objectId;
    try{
       const me= await staffMembers.findOne({_id:userID});
       const mySlots=me.scheduleSlots; 
       const result=["Choose..."];
       if(mySlots!=null)
       {
        for (const element of mySlots) {
            const theSlot= await slot.findOne({_id:element});
            var theDay="";
            var slotNumero="";
            if(theSlot.day==1)
            {
                theDay="Sataurday"
            }
            else if(theSlot.day==2)
            {
                theDay="Sunday"
            }
            else if(theSlot.day==3)
            {
                theDay="Monday"
            }
            else if(theSlot.day==4)
            {
                theDay="Tuesday"
            }
            else if(theSlot.day==5)
            {
                theDay="Wednesday"
            }
            else if(theSlot.day==6)
            {
                theDay="Thursday"
            }
            else if(theSlot.day==7)
            {
                theDay="Friday"
            }
            if(theSlot.slotNr==1)
            {
                slotNumero="1st"
            }
            else if(theSlot.slotNr==2)
            {
                slotNumero="2nd"
            }
            else if(theSlot.slotNr==3)
            {
                slotNumero="3rd"
            }
            else if(theSlot.slotNr==4)
            {
                slotNumero="4th"
            }
            else if(theSlot.slotNr==5)
            {
                slotNumero="5th"
            }
            const stringo= theDay + "-" + slotNumero + "-" + theSlot._id
            result.push(stringo)
        }
       }  
       res.send(result); 
    }
    catch(err){
        console.log(err)
    }
})

router.route('/peers')
.get(async(req,res)=>
{
    var ObjectId = require('mongodb').ObjectId; 
    const userID=req.user.objectId;
    try{
       const me= await staffMembers.findOne({_id:userID});
       const subType=me.subType;
       const myCourses=me.courses; 
       const result=["Choose..."];
       if(myCourses!=null)
       {
        for (const element of myCourses) {
            const theCourse= await course.findOne({courseName:element});
            const theStaff= subType=="ta"?theCourse.teachingAssistants: theCourse.instructors;
            for (const element2 of theStaff) {
                const peero = await staffMembers.findOne({_id:element2});
                result.push(peero.name);
            }
        }
       }  
       res.send(result); 
    }
    catch(err){
        console.log(err)
    }
})

router.route('/location')
.get(async(req,res)=>
{
    try{
        const locs= await location.find();
        const array=[];
        for (const element of locs) {
            array.push(element.roomNr);
        }
        res.send(array);
    }
    catch(err)
    {
        console.log(err)
    }
})
router.route('/schedule')
    .get(async(req,res)=>
        {
            var ObjectId = require('mongodb').ObjectId; 

            const userID=req.user.objectId;
            try{
            //get user object
            const user= await staffMembers.findOne({_id:userID});
            const slotsArray=user.scheduleSlots;
            const schedule=[];
            if(user.type=="HR")
            {
                res.status(401).send("User is not an academic staff member")
            }
            
            if(slotsArray!=null)
            for (const element of slotsArray) {
                var slot1= await slot.findOne({_id:element});
                var coursE= await course.findOne({_id:slot1.courseTaughtInSlot});
                var U = await staffMembers.findOne({_id: slot1.staffTeachingSlot})
                var loc= await location.findOne({_id: slot1.slotLocation})
                var user2 = await staffMembers.findOne({_id: slot1.replacementStaff})
                var displayedSlot=
                {
                    "day": slot1.day,
                    "slotNr":slot1.slotNr,
                    "startTime": slot1.startTime,
                    "endTime": slot1.endTime, // end time of slot
                    "courseTaughtInSlot": coursE.courseName,
                    "staffTeachingSlot": U==null?"NA":U.name,
                    "slotLocation": loc.roomNr,
                    "replacementStaff": user2==null?"NA":user2.name,
                }
                schedule.push(displayedSlot);
               }
            res.send(schedule);
            }
            catch(err)
            {
                console.log(err)
            }
        }
    )
   router.route('/replacementRequest')
    .post(
        async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const senderID=req.user.objectId;
        const sendingRequestTo=req.body.sendingRequestTo;//get id of reciever from request body
        var slotID=req.body.slotID;
        const day=req.body.day;
        const month=req.body.month;
        const theDate = new Date(2016, day, month);
        const temp=slotID.split("-")
        slotID=temp[2];
        
        try{
        //get sender object
        const senderObject= await staffMembers.findOne({_id:senderID});
        //get reciever object
        const recieverObject= await staffMembers.findOne({name:sendingRequestTo});
        //get slot object
        const slotObject= await slot.findOne({_id:ObjectId(slotID)});
        if(recieverObject!=null)//check if users exist
        {
            //check that user is not HR
            if(senderObject.type=="HR")
            {
            res.status(401).send("User is not an academic staff member")
            }
            //check if they are in the same department
            else if(senderObject.departmentName!=recieverObject.departmentName)
            {
                res.status(404).send("This staff member is not in the same department as you. Therefore, you can't send this replacement request")
            }
            else  if(slotObject==null)//check if slot exist
            {
                res.status(404).send("The slot that you are trying to find a replacement staff for doesnt exist")
            }
            else if(slotObject.staffTeachingSlot==null || !slotObject.staffTeachingSlot.equals(senderObject._id))//check slot is actually yours
            {
                res.status(401).send("You don't teach this slot!!!!!!!!!!!")
            }
            else //check if they are in the same course
            {
                var sameCourse=false;
                for (const element of recieverObject.courses) {
                    var courseObject= await course.findOne({courseName:element});
                        sameCourse=courseObject._id.equals(slotObject.courseTaughtInSlot)?true:sameCourse;
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
                        senderID: senderID, //id of the staff member sending the request
                        recieverID: recieverObject._id, //id of the staff member recieving the request
                        requestType: "replacement", //the available request types are change day off OR slot linking OR leave OR replacement)
                        status: "pending", //the value of status can either be accepted or rejected or pending
                        replacementSlot: ObjectId(slotID),
                        startOfLeave: theDate,
                        endOfLeave: theDate
                    }
                    );
                   await staffMembers.findOneAndUpdate({_id :
                        senderID},  { $push: { sentRequests: newRequest._id }}, {new: true});
                    await staffMembers.findOneAndUpdate({_id :
                        recieverObject._id},  { $push: { receivedRequests: newRequest._id }}, {new: true});
                
                   //save request in DB
                   const result = await newRequest.save();
                   const loc=await location.findOne({_id:slotObject.slotLocation});
                   const slot = 
                   {
                    "startTime": slotObject.startTime,
                    "endTime": slotObject.endTime,
                    "course taught in slot": courseObject.courseName,
                    "staff member teaching slot": senderObject.name,
                    "slotLocation": loc.roomNr
                    }
                   const output=
                   {
                    "Request sent by": senderObject.name,
                    "Request sent to": recieverObject.name,
                    "Type of request": "Replacement request",
                    "Status": "Pending",
                    "Slot to be replaced": slot,
                    "Date of replacement": theDate.toString()
                   }
                   res.send(output);
                }
           }
        }
        else
        {
            res.status(404).send("User not found");
        }
        }
        catch(err){
            console.log(err)
        }
        
    })
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        let userObject = await staffMembers.findOne({_id:userID})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        let array=[];
       if(userObject.receivedRequests!=null)
       {
        for (const element of userObject.receivedRequests) {
            var requestObject= await request.findOne({_id:element});
            if(requestObject.requestType=="replacement"){
                var U = await staffMembers.findOne({_id: requestObject.senderID})
                var sloty= await slot.findOne({_id: requestObject.replacementSlot})
                const courseObject=await course.findOne({_id:sloty.courseTaughtInSlot});
                const loc=await location.findOne({_id:sloty.slotLocation});
                const staff=await staffMembers.findOne({_id:sloty.staffTeachingSlot});
                   const S = 
                   {
                    "StartTime": sloty.startTime.toLocaleTimeString().substring(3),
                    "EndTime": sloty.endTime.toLocaleTimeString().substring(3),
                    "CourseTaughtInSlot": courseObject.courseName,
                    "staff member teaching slot": staff.name,
                    "SlotLocation": loc.roomNr
                    }
                var requestDisplayed=
                {
                    "id": requestObject._id,
                    "Sender": U.name, 
                    "Reciever": userObject.name,
                    "RequestType": requestObject.requestType,
                    "Status": requestObject.status,
                    "ReplacementSlot": S,
                }
                array.push(requestDisplayed);
            }
        }
       }
        res.send(array);
    })
    router.route('/acceptReplacementRequest')
    .post([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
          ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const requestID=req.body.requestID;// id of request that you want to accept
        //get user
        const user= await staffMembers.findOne({_id:userID});

        //get request
        const newRequest= await request.findOne({_id:ObjectId(requestID)});
        //check that user is not HR
        if(user.type=="HR")
        {
       // res.status(401).send("User is not an academic staff member")
        }
        if(newRequest==null)
        {
            //res.status(404).send("Request doesn't exist")
        }
        if(!user || !newRequest.recieverID.equals(user._id))
        {
            //res.status(401).send("You cannot accept someone elses request");
        }
        if(newRequest.requestType!="replacement")
        {
            //res.status(401).send("This is not a replacement request in the first place")
        }
        if(newRequest.status!="pending")
        {
            //res.status(401).send("You can only accept pending requests")
        }
        const d = new Date();
        if(d>newRequest.startOfLeave)
        {
            //res.status(401).send("The date inside the request has already passed. Cannot accept an outdated request.")
        }
        //passed all these checks then accept request
        if(newRequest.requestType=="replacement")
        {
            try
            {
                await request.findOneAndUpdate({_id: requestID}, {status:"accepted"}, {new: true});
                const message= user.name + " has accepted your " + newRequest.requestType + " request"
                await staffMembers.findOneAndUpdate({_id: newRequest.senderID}, { $push: { notifications: message}}, {new: true});
                res.send("Accepted")
            }
            catch(err)
            {
                console.log(err)
            }
        }
        else if(newRequest.requestType=="slot linking")
        {
            await request.findOneAndUpdate({_id: ObjectId(requestID)}, {status:"accepted"}, {new: true});
            const message= user.name + " has accepted your " + newRequest.requestType + " request"
            await staffMembers.findOneAndUpdate({_id: newRequest.senderID}, { $push: { notifications: message}}, {new: true});
            await staffMembers.findOneAndUpdate({_id: newRequest.senderID}, { $push: { scheduleSlots: newRequest.replacementSlot}}, {new: true});
            const person = await staffMembers.findOne({_id:newRequest.senderID});
            await slot.findOneAndUpdate({_id: newRequest.replacementSlot}, {staffTeachingSlot:person._id}, {new: true});
            await course.findOneAndUpdate({_id:courseObject._id}, {unassignedSlots:courseObject.unassignedSlots-1}, {new: true});
            
            res.send("Accepted")
        }
        else
        {
                await request.findOneAndUpdate({_id: requestID}, {status:"accepted"}, {new: true});
                const message= user.name + " has accepted your " + newRequest.requestType + " request"
                await staffMembers.findOneAndUpdate({_id: newRequest.senderID}, { $push: { notifications: message}}, {new: true});
                res.send("Accepted")
        }
        
    })
    router.route('/rejectReplacementRequest')
    .post([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
          ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;        
        const requestID=req.body.requestID;// id of request that you want to reject

        //get user
        const user= await staffMembers.findOne({_id:userID});
        //get request
        const newRequest= await request.findOne({_id:ObjectId(requestID)});
        if(user.type=="HR")
        {
        //res.status(401).send("User is not an academic staff member")
        }
        if(newRequest==null)
        {
            //res.status(404).send("Request doesn't exist")
        }
        if(!user || !newRequest.recieverID.equals(user._id))
        {
            //res.status(401).send("You cannot reject someone elses request");
        }
        if(newRequest.requestType!="replacement")
        {
            //res.status(401).send("This is not a replacement request in the first place")
        }
        if(newRequest.status!="pending")
        {
            //res.status(401).send("You can only reject pending requests")
        }
        //passed all these checks then reject request
        try
        {
            await request.findOneAndUpdate({_id: requestID}, {status:"rejected"}, {new: true});
            const message= user.name + " has rejected your " + newRequest.requestType + " request"
            await staffMembers.findOneAndUpdate({_id: newRequest.senderID}, { $push: { notifications: message}}, {new: true});
            res.send("Rejected")
        }
        catch(err)
        {
            console.log(err)
        }
    })
    router.route('/slotLinkingRequest')
    .post([
        body('slotID').isString().isLength(24).withMessage("slotID must be a string of length 24")
          ], [body('slotID').isString().isLength(24).withMessage("slotID must be a string of length 24")], 
          async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;        
        const slotID=req.body.slotID;// id of slot that you want to teach
        const dateOfRequest=req.body.dateOfRequest;
        try
        {
            //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:userID});
        //get the object of the desired slot
        const desiredSlot= await slot.findOne({_id:ObjectId(slotID)});
        if(user.type=="HR")//check that user is academic
        {
        res.status(401).send("User is not an academic staff member")
        }
        else if(desiredSlot==null)
        {
            res.status(404).send("The desired slot doesnt exist")
        }
        else{
             //create request
        const slotCourse = await course.findOne({_id: desiredSlot.courseTaughtInSlot})//get the course in order to know the course coordinator
        if(slotCourse==null)
        {
            res.status(404).send("The desired slot doesnt belong to a course. Therefore, failed to send to coordinator.")
        }
        const newRequest = new request(
            {
                senderID: userID, //id of the staff member sending the request
                recieverID: slotCourse.coordinator, //id of the staff member recieving the request
                requestType: "slot linking", //the available request types are change day off OR slot linking OR leave OR replacement)
                status: "pending", //the value of status can either be accepted or rejected or pending
                replacementSlot: ObjectId(slotID), //id of slot for replacement request
                startOfLeave: dateOfRequest,
                endOfLeave: dateOfRequest
            }
        );
        newRequest.save();
        await staffMembers.findOneAndUpdate({_id :userID}, { $push: { sentRequests: newRequest._id }}, {new: true});
        await staffMembers.findOneAndUpdate({_id :slotCourse.coordinator}, { $push: { receivedRequests: newRequest._id }}, {new: true});
        const reciever= await staffMembers.find({_id:newRequest.recieverID})  ;
        const sloty= await slot.findOne({_id:newRequest.replacementSlot});
        const loc=await location.findOne({_id:sloty.slotLocation});
        const S = 
         {
          "startTime": sloty.startTime,
          "endTime": sloty.endTime,
          "taughtBy": slotCourse.courseName,
          "location": loc.roomNr
          }
        const output=
        {
            "Sender": reciever.name,
            "RequestType": "slot linking",
            "Status": "pending",
            "DesiredDayOff": S,
        }
        res.send(output);
        }
        }
        catch(err)
        {
            console.log(err);
        }
    })
    router.route('/changeDayOffRequest')
    .post(  [
                body('reasonForChange').isString().optional().withMessage("reasonForChange must be a string")
            ],
            [
                body('desiredDayOff').isString().withMessage("desiredDayOff must be a string")
            ],
                  async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 
        const userID= req.user.objectId;
        const reasonForChange=req.body.reasonForChange;// this is optional
        const desiredDayOff= req.body.desiredDayOff;

        try
        {
            //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:userID});
        //get department of user
        const departmentName=user.departmentName;
        if(user.type=="HR")//check that user is academic
        {
        res.status(401).send("User is not an academic staff member")
        }
        else if(departmentName==null)
        {
            res.status(404).send("user is not in a department. Thus, there is no HOD of department to send this request to")
        }
        /*else if(desiredDayOff==null || (desiredDayOff!="SAT" && desiredDayOff!="SUN" && desiredDayOff!="MON" && desiredDayOff!="TUES" && desiredDayOff!="WED" && desiredDayOff!="THURS"))
        {
            res.status(404).send("Not a valid day of the week")
        }*/
        else
        {
            //get the object of the department
        const departmentObj= await department.findOne({departmentName:departmentName});
        //create request
        var newRequest=null;
        if(reasonForChange!=null)
        {
            newRequest = new request(
                {
                    senderID: userID, //id of the staff member sending the request
                    recieverID: departmentObj.HOD_id, //id of the staff member recieving the request
                    requestType: "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                    status: "pending", //the value of status can either be accepted or rejected or pending
                    DesiredDayOff:desiredDayOff,
                    requestReason: reasonForChange
                }
            );
        }
        else
        {
            newRequest = new request(
            {
                    senderID: userID, //id of the staff member sending the request
                    recieverID: departmentObj.HOD_id, //id of the staff member recieving the request
                    requestType: "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                    DesiredDayOff:desiredDayOff,
                    status: "pending", //the value of status can either be accepted or rejected or pending
            }
            );
        }
        newRequest.save();
        await staffMembers.findOneAndUpdate({_id:userID}, { $push: { sentRequests: newRequest._id }}, {new: true});
        await staffMembers.findOneAndUpdate({_id :departmentObj.HOD_id}, { $push: { receivedRequests: newRequest._id }}, {new: true});
       const HOD = await staffMembers.findOne({_id :departmentObj.HOD_id});
        const result=
        {
            "Sent by": user.name,
            "Recieved by": HOD.name + " (HOD)",
            "requestType": "change day off",
            "status": "pending",
            "DesiredDayOff": newRequest.desiredDayOff,
            "requestReason": newRequest.requestReason
        }
        res.send(result);
    }
        }
        catch(err)
        {
            console.log(err)
        }
    });
    router.route('/leave')
    .post([
        body('documents').isString().optional().withMessage("documents must be a string")
    ], [
        body('reason').isString().optional().withMessage("reason must be a string")
    ],[
        body('leaveType').isString().withMessage("leaveType must be a string")
    ],[
        body('replacementStaff').isString().optional().withMessage("replacementStaff must be a string")
    ],async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const sndrID=req.user.objectId;        
        const documents=req.body.documents;
        const reason= req.body.reason;
        const leaveType= req.body.leaveType;
        const replacementStaff= req.body.replacementStaff;
        const startMonth=req.body.startMonth;
        const startDay=req.body.startDay;
        const endMonth=req.body.endMonth;
        const endDay=req.body.endDay;
        const startLeave= new Date("2020", startMonth, startDay)
        const endLeave= new Date("2020", endMonth, endDay)

        try
        {
            //get user sending the slot linking using the userID
            const user= await staffMembers.findOne({_id:sndrID});
            //get department of user
            const departmentName=user.departmentName;
            if(user.type=="HR")//check that user is academic
            {
            res.status(401).send("User is not an academic staff member")
            }
            else if(departmentName==null)
            {
                res.status(404).send("user is not in a department. Thus, there is no HOD of department to send this request to")
            }
            else if(documents==null && (leaveType=="sick leave" || leaveType=="maternity leave"))
            {
                res.status(404).send("Didn't submit relavent documents with request. Therefore, cannot submit leave request")
            }
            else if(reason==null && leaveType=="compensation leave")
            {
                res.status(404).send("You must submit a reason for the compensation leave")
            }
            else if(startLeave==null || endLeave==null)
            {
                res.status(404).send("Must specify dates for leaves")
            }
            else
            {
                const departmentObj= await department.findOne({departmentName:departmentName});
                //submit leave
                var leave = new request
                (
                    {
                        senderID: sndrID,
                        recieverID: departmentObj.HOD_id,
                        requestType: leaveType,
                        status: "pending",
                        startOfLeave: startLeave,
                        endOfLeave: endLeave
                    }
                );
                leave.save();
               if(replacementStaff!=null)
               {
                const result= await request.findOneAndUpdate({_id :
                    leave._id}, {replacementStaffName:replacementStaff}, {new: true})
               }
               if(reason!=null)
               {
                const result= await request.findOneAndUpdate({_id :
                    leave._id}, {requestReason:reason}, {new: true})
               }
               if(documents!=null)
               {
                const result= await request.findOneAndUpdate({_id :
                    leave._id}, {relaventLeaveDocuments:documents}, {new: true})
               }
               const resulto=await await request.findOne({_id :
                leave._id});
                await staffMembers.findOneAndUpdate({_id :sndrID}, { $push: { sentRequests: leave._id }}, {new: true});
                await staffMembers.findOneAndUpdate({_id :departmentObj.HOD_id}, { $push: { receivedRequests: leave._id }}, {new: true});
                const HOD = await staffMembers.findOne({_id :departmentObj.HOD_id});
                const output =
                {
                    "Leave request sent by": user.name,
                    "Leave request sent to": HOD.name + " (HOD)",
                    status: "pending",
                    replacementStaffName: replacementStaff,
                    relaventLeaveDocuments: documents,
                    requestReason: reason,
                    startOfLeave: startLeave,
                    endOfLeave: endLeave
                }
                res.send(output);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    })
    router.route('/requestStatus')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        try{
            let userObject = await staffMembers.findOne({_id:userID})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;

        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
            var requestObject= await request.findOne({_id:element});
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "id":requestObject._id,
                    "sender": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                    "date": requestObject.startOfLeave                }
            array.push(requestDisplayed);
        }
        res.send(array);
        }
        catch(err)
        {
            console.log(err);
        }
    })
    router.route('/requestStaus/accepted')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        try
        {
            let userObject = await staffMembers.findOne({_id:userID})
            if(userObject.type=="HR")
            {
                res.status(401).send("User is not an academic staff member")
            }
            const requetsSent = userObject.sentRequests;
            let array=[];
            if(requetsSent!=null)
             for (const element of requetsSent) {
                var requestObject= await request.findOne({_id:element});
                var U = await staffMembers.findOne({_id: requestObject.recieverID})
                    var requestDisplayed=
                    {
                        "id":requestObject._id,
                        "sender": U.name, 
                        "requestType": requestObject.requestType,
                        "status": requestObject.status,
                        "date": requestObject.startOfLeave                    }
                 if(requestObject.status=="accepted")
                 array.push(requestDisplayed);
                }
            res.send(array);
        }
        catch(err)
        {
            console.log(err)
        }
    })
    router.route('/requestStaus/rejected')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;

        try{
            let userObject = await staffMembers.findOne({_id:userID})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
            var requestObject= await request.findOne({_id:element});
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "id":requestObject._id,
                    "sender": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                    "date": requestObject.startOfLeave                }
             if(requestObject.status=="rejected")
             array.push(requestDisplayed);
        }
        res.send(array);
        }
        catch(err)
        {
            console.log(err)
        }
    })
    router.route('/requestStaus/pending')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        try
        {
            let userObject = await staffMembers.findOne({_id:userID})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const requetsSent = userObject.sentRequests;
        let array=[];
        if(requetsSent!=null)
         for (const element of requetsSent) {
            var requestObject= await request.findOne({_id:element});
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "id":requestObject._id,
                    "sender": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                    "date": requestObject.startOfLeave
                }
             if(requestObject.status=="pending")
             array.push(requestDisplayed);
        }
        res.send(array);
        }
        catch(err)
        {
            console.log(err);
        }
    })
    router.route('/cancleRequest')
    .post([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        const requestID=req.body.requestID;// id of the request that we want to cancel
        const currentDate = new Date();
        try
        {
            let userObject = await staffMembers.findOne({_id:userID})//object of the user wanting to cancel the request
            const requestObject = await request.findOne({_id:ObjectId(requestID)});// reuest that he wants to cancle
        if(userObject.type=="HR")//if he is an HR staff member then this route is not for him
        {
            res.status(401).send("User is not an academic staff member")
        }
        else if(requestObject==null)//request doesn't exist
        {
            res.status(404).send("Request not found");
        }
        //check if he is the one who sent the request
        else if(!requestObject.senderID.equals(userObject._id))
        {
            res.status(401).send("You are not authorized to cancel this request since you are not the sender");
        }
        //check if the request is still pending or before current date
        else if(requestObject.status!="pending" && requestObject.startLeave>currentDate)
        {
            res.status(401).send("You are not authorized to cancel this request since it is no longer pending");
        }
        else
        {
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
        const result= await request.deleteOne({_id:requestObject._id});
        res.send("Successfully deleted");
        }
        }
        catch(err)
        {
            console.log(err);
        }
    })
    router.route('/notifications')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.user.objectId;
        try
        {
            let userObject = await staffMembers.findOne({_id:userID})
        if(userObject.type=="HR")
        {
            res.status(401).send("User is not an academic staff member")
        }
        const notifications = userObject.notifications;
        if(notifications==null)notifications=[];
        res.send(notifications);
        }
        catch(err)
        {
            console.log(err);
        }
    })
module.exports=router;