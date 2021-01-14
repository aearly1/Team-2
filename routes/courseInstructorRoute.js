const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require("../middleware/auth");
const departmentModel = require('../models/Department');
const courseModel = require('../models/course');
const staffModel = require('../models/staffMembers');
const slotModel= require('../models/slot.js');
const { check, validationResult } = require('express-validator');
const { Server, ObjectId } = require('mongodb');

(async()=>{
const app=express();
app.use(express.json());

//View the coverage of course(s) he/she is assigned to.
router.get("/view-courses/:id", auth ,[check ("id").isNumeric()] 
 ,async (req, res) => {
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        if( staffModel.findById(req.params.id).courses==""){
            return res.send("No courses are assigned");
        }else{
        const user= await  staffModel.findById(req.params.id) ;
        res.json(user.courses); }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View the slots’ assignment of course(s) he/she is assigned to.
router.route("/view-slot-assign-course/:id",auth,[check ("id").isNumeric()])
.get( async (req, res) => {
    var ObjectId = require('mongodb').ObjectId; 
   // const userID=req.body.userID;
    let userObject = await staffMembers.findOne({_id:ObjectId(req.params.id)})//fetch supposed instructor
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        if(staffModel.findById(req.params.id).courses==null){ //HR
            return res.send("No slots are assigned");
       }else{
        const user= await  staffModel.findById(req.params.id) ;
        res.json(user.slots);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View all the staff per course along with their profiles.

router.route("/view-staf-course/:id",auth, 
[ 
check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
])
.get( async (req, res) => {
    const user = await staffModel.findById(req.param.id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        let staffOutput = [];
        let usercourses = await staffModel.find({"courses": user.courses})
        usercourses.forEach(stafcourse=>staffOutput.push({
            userCode: staffMem.id,
            email: staffMem.email,
            name: staffMem.name
        }))
       res.json(staffOutput);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View all the staff in his/her department along with their profiles.

router.route("/view-staf-dep/:id",auth, 
[
    check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
])
.get( async (req, res) => {
    const user = await staffModel.findById(req.param.id)
    const errors = validationResult(req);
    const currentdepartement =user.departmentName ;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        let staff = await staffModel.find({"departementName":currentdepartement});
        let staffOutput = [];
        staff.forEach(staffMem => staffOutput.push({
            userCode: staffMem.id,
            email: staffMem.email,
            name: staffMem.name
        }))
        res.status(200).json(staffOutput);  
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
router.route("/assign-course/:id",auth).post( 
    async (req, res) =>{
        const user = await staffModel.findById(req.param.id)
        const courseID=req.body.courseID;
        const academicID=req.body.academicID
        const slotID=req.body.slotID


        try{
        // const courses =await staffModel.findOne({courses:academicID.courses})
         const currentcourse=courseModel.findOne({_id:ObjectId(courseID)})
         const newunassignedslots =courseModel.findOne({_id:ObjectId(courseID)}) -1 ;

         if(!courseID==courseModel.findOne({_id:ObjectId(courseID)})){
             res.send("course not found");
         }else{
       //coordinator academic
       if(courseID ==courseModel.findOne({_id:ObjectId(courseID)} && academicID==courseModel.findOne({coordinator:ObjectId(academicID)}) )){
         const result = 
         await
          slotModel.findByIdAndUpdate(_id=objectID(slotID),{courseTaughtInSlot: objectID(courseID)},{staffTeachingslot:objectID(academicID)});
         const coursetemp= courseModel.findById({_id:objectID(courseID)})
         
         coursetemp. teachingSlots.push(slotModel.findById({id:objectID(slotID)}));
         coursetemp.coordinator =objectID(academicID)
         coursetemp.unassignslots=newunassignedslots
         await coursetemp.save();
          res.json(coursetemp)
        }
    //instructor academic
          if(courseID ==courseModel.findOne({_id:ObjectId(courseID)} && academicID==courseModel.findOne({instructors:ObjectId(academicID)}) )){
            const result = 
            await
             slotModel.findByIdAndUpdate(_id=objectID(slotID),{courseTaughtInSlot: objectID(courseID)},{staffTeachingslot:objectID(academicID)});
            const coursetemp= courseModel.findById({_id:objectID(courseID)})
            
            coursetemp. teachingSlots.push(slotModel.findById({id:objectID(slotID)}));
            coursetemp.instructors.push(objectID(academicID))
            coursetemp.unassignslots=newunassignedslots
            await coursetemp.save();
             res.json(coursetemp)}
      //teaching assistant academic
      if(courseID ==courseModel.findOne({_id:ObjectId(courseID)} && academicID==courseModel.findOne({teachingAssistants:ObjectId(academicID)}) )){
        const result = 
        await
         slotModel.findByIdAndUpdate(_id=objectID(slotID),{courseTaughtInSlot: objectID(courseID)},{staffTeachingslot:objectID(academicID)});
        const coursetemp= courseModel.findById({_id:objectID(courseID)})
        
        coursetemp. teachingSlots.push(slotModel.findById({id:objectID(slotID)}));
        coursetemp.teachingAssistants.push(objectID(academicID))
        coursetemp.unassignslots=newunassignedslots
        await coursetemp.save();
         res.json(coursetemp)
         }}
        }catch{
            console.error(err.message);
                res.status(500).send("Server Error");
        }
        });

//Update assignment of academic member in course(s) he/she is assigned to.
router.route("/update-assign/:id",auth,)
.post(
    [
    check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
     check("courseID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24)
    ]
    ,async(req,res) =>{
        const user = await staffModel.findById(req.param.id)
        const courseID=req.body.courseID;
        const academicID=req.body.academicID

    try{
        if(req.param.id==await courseModel.findOne({"instructors":academicID})){
        await courseModel.findOneAndUpdate(_id=ObjectId(courseID),{instructors:objectID(academicID)});
    }
    if(req.param.id==await courseModel.findOne({"coordinator":academicID})){
         await courseModel.findOneAndUpdate(_id=ObjectId(courseID),{coordinator:academicID});
    }
    if(req.param.id==await courseModel.findOne({"teachingAssistants":academicID})){
        await courseModel.findOneAndUpdate(_id=ObjectId(courseID),{teachingAssistants:objectID(academicID)});
    }
  
        res.send("Updated successfully");
    }catch{
        console.error(err.message);
            res.status(500).send("Server Error");
    }
    });

 //  delete assignment of academic member in course(s) he/she is assigned to.
    router.route("/delete-assign/:id",auth)
    .post(
        [
        check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
         check("courseID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24)
        ]
        ,async(req,res) =>{
            const user = await staffModel.findById(req.param.id)
            const courseID=req.body.courseID;
            
    
        try{
            if(req.param.id==await courseModel.findOne({instructors:user})){
            await courseModel.findByIdAndDelete(instructors=objectID(user));
            await staffModel.findByIdAndUpdate(courses=objectID(courseID),{$push: { courses:ObjectId(courseID)}})   
        }
        if(req.param.id==await courseModel.findOne({coordinator:user})){
           await courseModel.findByIdAndDelete(coordinator=objectID(user));
           await staffModel.findByIdAndUpdate(courses=objectID(courseID),{$push: { courses:ObjectId(courseID)}})   
        }

        if(req.param.id==await courseModel.findOne({"teachingAssistants":user})){

            await courseModel.findByIdAndDelete(teachingAssistants=objectID(user));
            await staffModel.findByIdAndUpdate(courses=objectID(courseID),{$push: { courses:ObjectId(courseID)}})  
        }
            res.send("Deleted succesfully");
        }catch{
            console.error(err.message);
                res.status(500).send("Server Error");
        }
        });


        
//Assign an academic member in each of his/her course(s) to be a course coordinator.
router.route("/assign-academic/:id",auth).post(
     [
       check("userID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24),
       check("courseID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24)
    ]
    ,async(req,res) =>{
        const user = await staffModel.findById(req.param.id)
        const courseID=req.body.courseID;
        const academicID=req.body.academicID

        
    try{
     if(req.param.id==await courseModel.findOne({coordinator:user})){
         res.sstatus(404).send("already a coordinator")
     }else{
         const result = await courseModel.findByIdAndUpdate(_id=courseID,{coordinator:objectID(academicID)})
         res.json(result);
     }
    }catch{
        console.error(err.message);
            res.status(500).send("Server Error");
    }
    });

    app.listen(3000,function()
    {
        console.log("Server started at port 3000");
    });

})
//.catch((err)=>{console.log(err)})
module.exports=router;