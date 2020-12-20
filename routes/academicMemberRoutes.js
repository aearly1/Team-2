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
    app.route('/schedule')
    .get(async(req,res)=>
        {
            var ObjectId = require('mongodb').ObjectId; 
            const userID=req.body.userID; //get id of requeSter from request body (TO BE CHANGED TO TOKEN)
            try{
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
                var slot1= await slot.findOne({_id:element});
                var coursE= await course.findOne({_id:slot1.courseTaughtInSlot});
                var U = await staffMembers.findOne({_id: slot1.staffTeachingSlot})
                var loc= await location.findOne({_id: slot1.slotLocation})
                var user2 = await staffMembers.findOne({_id: slot1.replacementStaff})
                var displayedSlot=
                {
                    "startTime": slot1.startTime,
                    "endTime": slot1.endTime, // end time of slot
                    "courseTaughtInSlot": coursE.name,
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
   app.route('/replacementRequest')
    .post([
        body('slotID').isString().isLength(24).withMessage("slotID must be a string of length 24"),
        body('recieverID').isString().isLength(24).withMessage("recieverID must be a string of length 24")
          ],async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const senderID=req.body.senderID; //get id of requeSter from request body (TO BE CHANGED TO TOKEN)
        const recieverID=req.body.recieverID;//get id of reciever from request body
        const slotID=req.body.slotID;
        try{
        //get sender object
        const senderObject= await staffMembers.findOne({_id:ObjectId(senderID)});
        //get reciever object
        const recieverObject= await staffMembers.findOne({_id:ObjectId(recieverID)});
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
            else if(senderObject.facultyName!=recieverObject.facultyName)
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
                        requestType: "replacement", //the available request types are change day off OR slot linking OR leave OR replacement)
                        status: "pending", //the value of status can either be accepted or rejected or pending
                        replacementSlot: ObjectId(slotID)
                    }
                    );
                   await staffMembers.findOneAndUpdate({_id :
                        ObjectId(senderID)},  { $push: { sentRequests: newRequest._id }}, {new: true});
                    await staffMembers.findOneAndUpdate({_id :
                        ObjectId(recieverID)},  { $push: { receivedRequests: newRequest._id }}, {new: true});
                    //TESTING
                    const senderTest= await staffMembers.findOne({_id:ObjectId(senderID)})
                    const recieverTest= await staffMembers.findOne({_id:ObjectId(recieverID)})
                   //save request in DB
                   const result = await newRequest.save();
                   res.send(result);
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
            var U = await staffMembers.findOne({_id: requestObject.senderID})
                var sloty= await slot.findOne({_id: requestObject.replacementSlot})
                var requestDisplayed=
                {
                    "request sent by": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                    "replacementSlot": sloty,
                }
                if(requestObject.requestType=="replacement")array.push(requestDisplayed);
                }
        res.send(array);
    })
    app.route('/acceptReplacementRequest')
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

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const requestID=req.body.requestID;// id of request that you want to accept

        //get user
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
        //get request
        const newRequest= await request.findOne({_id:ObjectId(requestID)});
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
    .post([
        body('slotID').isString().isLength(24).withMessage("slotID must be a string of length 24")
          ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the slot linking request from request body (TO BE CHANGED TO TOKEN)
        const slotID=req.body.slotID;// id of slot that you want to teach
        try
        {
            //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
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
                senderID: ObjectId(userID), //id of the staff member sending the request
                recieverID: slotCourse.coordinator, //id of the staff member recieving the request
                requestType: "slot linking", //the available request types are change day off OR slot linking OR leave OR replacement)
                status: "pending", //the value of status can either be accepted or rejected or pending
                replacementSlot: ObjectId(slotID), //id of slot for replacement request
            }
        );
        newRequest.save();
        await staffMembers.findOneAndUpdate({_id :ObjectId(userID)}, { $push: { sentRequests: newRequest._id }}, {new: true});
        await staffMembers.findOneAndUpdate({_id :slotCourse.coordinator}, { $push: { receivedRequests: newRequest._id }}, {new: true});
        res.send(newRequest);
        }
        }
        catch(err)
        {
            console.log(err);
        }
    })
    app.route('/changeDayOffRequest')
    .post(  [
                body('reasonForChange').isString().withMessage("reasonForChange must be a string")
            ],
            [
                body('desiredDayOff').isString().isLength(24).withMessage("desiredDayOff must be a string")
            ],
                  async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const userID=req.body.userID; //get id of user sending the change day off request from request body (TO BE CHANGED TO TOKEN)
        const reasonForChange=req.body.reasonForChange;// this is optional
        const desiredDayOff= req.body.desiredDayOff;

        try
        {
            //get user sending the slot linking using the userID
        const user= await staffMembers.findOne({_id:ObjectId(userID)});
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
        else if(desiredDayOff==null || (desiredDayOff!="SAT" && desiredDayOff!="SUN" && desiredDayOff!="MON" && desiredDayOff!="TUES" && desiredDayOff!="WED" && desiredDayOff!="THURS"))
        {
            res.status(404).send("Not a valid day of the week")
        }
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
                    senderID: ObjectId(userID), //id of the staff member sending the request
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
                    senderID: ObjectId(userID), //id of the staff member sending the request
                    recieverID: departmentObj.HOD_id, //id of the staff member recieving the request
                    requestType: "change day off", //the available request types are change day off OR slot linking OR leave OR replacement)
                    DesiredDayOff:desiredDayOff,
                    status: "pending", //the value of status can either be accepted or rejected or pending
                }
            );
        }
        newRequest.save();
        await staffMembers.findOneAndUpdate({_id :ObjectId(userID)}, { $push: { sentRequests: newRequest._id }}, {new: true});
        await staffMembers.findOneAndUpdate({_id :departmentObj.HOD_id}, { $push: { receivedRequests: newRequest._id }}, {new: true});
        res.send(newRequest);
    }
        }
        catch(err)
        {
            console.log(err)
        }
    });
    app.route('/leave')
    .post([
        body('documents').isString().withMessage("documents must be a string")
    ], [
        body('reason').isString().withMessage("reason must be a string")
    ],[
        body('leaveType').isString().withMessage("leaveType must be a string")
    ],[
        body('replacementStaff').isString().withMessage("replacementStaff must be a string")
    ],async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        const sndrID= req.body.sndrID;
        const documents=req.body.documents;
        const reason= req.body.reason;
        const leaveType= req.body.leaveType;
        const replacementStaff= req.body.replacementStaff;

        try
        {
            //get user sending the slot linking using the userID
            const user= await staffMembers.findOne({_id:ObjectId(sndrID)});
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
            else if(leaveType!="annual leave" && leaveType!="accidental leave" && leaveType!="sick leave" && leaveType!="maternity leave" && leaveType!="compensation leave")
            {
                res.status(404).send("Invalid leave type")
            }
            else if(documents==null && (leaveType=="sick leave" || leaveType=="maternity leave"))
            {
                res.status(404).send("Didn't submit relavent documents with request. Therefore, cannot submit leave request")
            }
            else if(reason==null && leaveType=="compensation leave")
            {
                res.status(404).send("You must submit a reason for the compensation leave")
            }
            else
            {
                const departmentObj= await department.findOne({departmentName:departmentName});
                //submit leave
                var leave = new request
                (
                    {
                        senderID: ObjectId(sndrID),
                        recieverID: departmentObj.HOD_id,
                        requestType: leaveType,
                        status: "pending",
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
                await staffMembers.findOneAndUpdate({_id :ObjectId(sndrID)}, { $push: { sentRequests: leave._id }}, {new: true});
                await staffMembers.findOneAndUpdate({_id :departmentObj.HOD_id}, { $push: { receivedRequests: leave._id }}, {new: true});
                res.send(resulto);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    })
    app.route('/requestStatus')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        try{
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
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "request sent to": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                }
            array.push(requestDisplayed);
        }
        res.send(array);
        }
        catch(err)
        {
            console.log(err);
        }
    })
    app.route('/requestStaus/accepted')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        try
        {
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
                var U = await staffMembers.findOne({_id: requestObject.recieverID})
                    var requestDisplayed=
                    {
                        "request sent to": U.name, 
                        "requestType": requestObject.requestType,
                        "status": requestObject.status,
                    }
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
    app.route('/requestStaus/rejected')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;

        try{
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
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "request sent to": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
                }
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
    app.route('/requestStaus/pending')
    .get(async(req,res)=>
    {
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;

        try
        {
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
            var U = await staffMembers.findOne({_id: requestObject.recieverID})
                var requestDisplayed=
                {
                    "request sent to": U.name, 
                    "requestType": requestObject.requestType,
                    "status": requestObject.status,
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
    app.route('/cancleRequest')
    .get([
        body('requestID').isString().isLength(24).withMessage("requestID must be a string of length 24")
    ], async(req,res)=>
    {
        const errors = validationResult(req);
         if (!errors.isEmpty()) 
         {
            return res.status(400).json({ errors: errors.array() });
        }
        var ObjectId = require('mongodb').ObjectId; 

        //CHANGE THIS TO TOKEN
        const userID=req.body.userID;
        const requestID=req.body.requestID;// id of the request that we want to cancel
        try
        {
            let userObject = await staffMembers.findOne({_id:ObjectId(userID)})//object of the user wanting to cancel the request
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
        //check if the request is still pending
        else if(requestObject.status!="pending")
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
 
    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });
})
.catch((err)=>{
    console.log(err)
})

module.exports=router;
