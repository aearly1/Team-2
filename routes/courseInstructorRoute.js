const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require("../middleware/auth");
const course = require('../models/course');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');
const { check, validationResult } = require('express-validator');
const { Server, ObjectId } = require('mongodb');

//View the coverage of course(s) he/she is assigned to.
router.route("/view-course-coverage/:course")
.get([check ("course").isString()],
async (req, res) => {
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        const myCourse= await course.findOne({"courseName":req.params.course});
        if(myCourse==null)
        {
            res.status(404).send("Course not found!")
        }
        else
        {
            const instructorId=req.user.id;
            const instructor= await staffMembers.findOne({id:instructorId});
            const intructorsList = myCourse.instructors;
            var found=false;
            if(intructorsList!=null)
            {
                for (const element of intructorsList)
                {
                    if(element.equals(instructor._id))
                    {
                        found=true;
                    }
                }
            }
            if(!found)
            {
                res.status(401).send("User is not an instructor or is not an instructor of that course")
            }
            else
            {

                const assignedSlots=myCourse.teachingSlots.length-myCourse.unassignedSlots;
                var result=0;
                if(myCourse.teachingSlots.length!=0)
                {
                    result=assignedSlots/myCourse.teachingSlots.length;
                }
                res.send("Course coverage of this course is " + result+"%")
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View the slots’ assignment of course(s) he/she is assigned to.
router.route("/view-slot-assign-course/:course")
.get( async (req, res) => {
    var ObjectId = require('mongodb').ObjectId; 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        const myCourse= await course.findOne({"courseName":req.params.course});
        if(myCourse==null)
        {
            res.status(404).send("Course not found!")
        }
        else
        {
            const instructorId=req.user.id;
            const instructor= await staffMembers.findOne({id:instructorId});
            const intructorsList = myCourse.instructors;
            var found=false;
            if(intructorsList!=null)
            {
                for (const element of intructorsList)
                {
                    if(element.equals(instructor._id))
                    {
                        found=true;
                    }
                }
            }
            if(!found)
            {
                res.status(401).send("User is not an instructor or is not an instructor of that course")
            }
            else
            {
                const slots=myCourse.teachingSlots;                
                const schedule=[];
                for (const element of slots)
                {
                    const sloty= await slot.findOne({_id:element});
                    console.log(sloty)
                    const staff =await staffMembers.findOne({_id:sloty.staffTeachingSlot});
                    const slotOutput=
                    {
                        "startTime": sloty.startTime, //start time of slot
                        "endTime": sloty.endTime, //what course will be taught in the slot 
                        "staff assigned to course": staff==null?"Slot not assigned yet":staff.name// null if this slot is still not assigned to anyon
                    }
                    schedule.push(slotOutput);
                }
                res.send(schedule);
            }
       
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View all the staff per course along with their profiles.

router.route("/view-staff-course/:course", 
)
.get( async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
        try {
            const myCourse= await course.findOne({"courseName":req.params.course});
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                    const instructors=myCourse.instructors;                
                    const profiles=[];
                    for (const element of instructors)
                    {
                        const staff= await staffMembers.findOne({_id:element});
                        const singleProfile=
                        {
                            "userCode": staff.id,
                            "subType": "Instructor",
                            "email": staff.email,
                            "name": staff.name,
                            "office": staff.office
                        }
                        profiles.push(singleProfile);
                    }
                    const TAS=myCourse.teachingAssistants;                
                    for (const element of TAS)
                    {
                        const staff= await staffMembers.findOne({_id:element});
                        const singleProfile=
                        {
                            "userCode": staff.id,
                            "subType": "Teaching Assistant",
                            "email": staff.email,
                            "name": staff.name,
                            "office": staff.office
                        }
                        profiles.push(singleProfile);
                    }
                    res.send(profiles);
                }
           
            }
        }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//View all the staff in his/her department along with their profiles.

router.route("/view-staff-dep"
)
.get( async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
        try {
            const instructorId=req.user.id;
            const instructor= await staffMembers.findOne({id:instructorId});
            if(instructor.subType==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const ppl=await staffMembers.find({departmentName:instructor.departmentName});   
                const profiles=[];
                for (const element of ppl)
                {
                    const staff= await staffMembers.findOne({_id:element});
                    const singleProfile=
                    {
                        "userCode": staff.id,
                        "imgLink":  staff.imgLink,
                        "subType": staff.subType,
                        "email": staff.email,
                        "name": staff.name,
                        "office": staff.office
                    }
                    profiles.push(singleProfile);
                }
                res.send(profiles);
            }
        }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
router.route("/assign-course/:course").post( 
    [check ("academicId").isString()],
    [check ("slotID").isString().isLength(24)],
    async (req, res) =>{
        try
        {
            const myCourse= await course.findOne({"courseName":req.params.course});
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                   const theSlot = await slot.findOne({_id:req.body.slotID});
                   const theAcademicUser= await staffMembers.findOne({id:req.body.academicId});
                   if(theSlot==null || theSlot.staffTeachingSlot!=null || !theSlot.courseTaughtInSlot.equals(myCourse._id))
                   {
                       res.status(401).send("You cannot assign this slot to anyone")
                   }
                   else if(theAcademicUser==null)
                   {
                        res.status(401).send("The academic member that you want to assign this slot to doesn't exist")
                   }
                   else
                   {
                       var found1=false;
                        const coursesOfTheAcademic=theAcademicUser.courses;
                        if(coursesOfTheAcademic!=null)
                        {
                            for (const element of coursesOfTheAcademic)
                            {
                                if(myCourse.courseName==element)
                                 {
                                    found1=true;break;
                                 }
                            }
                        }
                        if(!found1)
                        {
                            res.status(404).send("Academic user that you want to assign this slot to is not in this course")
                        }
                        else
                        {
                            await course.findOneAndUpdate({_id:myCourse._id},{unassignedSlots:myCourse.unassignedSlots+1}, {new: true})
                            const sloty=await slot.findOneAndUpdate({_id:theSlot._id},{staffTeachingSlot:theAcademicUser._id}, {new: true})
                            await staffMembers.findByIdAndUpdate({_id:theAcademicUser._id},{$push: {scheduleSlots:theSlot._id}})  
                            const result=
                            {
                                startTime: sloty.startTime,
                                endTime: sloty.endTime,
                                courseTaughtInSlot: myCourse.name,
                                staffTeachingSlot: theAcademicUser.name,
                            }
                            res.send(result)
                        }
                   }
                }
           
            }
        }
        catch(err)
        {
            console.log(err)
        }
    });

//Update assignment of academic member in course(s) he/she is assigned to.
router.route("/update-assign/:course",)
.post(
    [check ("academicId").isString()],
    [check ("slotID").isString().isLength(24)], async(req,res) =>{

        try
        {
            const myCourse= await course.findOne({"courseName":req.params.course});
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                   const theSlot = await slot.findOne({_id:req.body.slotID});
                   const theAcademicUser= await staffMembers.findOne({id:req.body.academicId});
                   console.log(theAcademicUser)
                   console.log(req.body.academicId)
                   if(theSlot==null || !theSlot.courseTaughtInSlot.equals(myCourse._id))
                   {
                       res.status(401).send("You cannot assign this slot to anyone")
                   }
                   else if(theAcademicUser==null)
                   {
                        res.status(401).send("The academic member that you want to assign this slot too doesn't exist")
                   }
                   else
                   {
                       var found1=false;
                        const coursesOfTheAcademic=theAcademicUser.courses;
                        if(coursesOfTheAcademic!=null)
                        {
                            for (const element of coursesOfTheAcademic)
                            {
                                 if(myCourse.courseName.equals(element))
                                 {
                                    found1=true;break;
                                 }
                            }
                        }
                        if(!found1)
                        {
                            res.status(404).send("Academic user that you want to assign this slot to is not in this course")
                        }
                        else
                        {
                            //delete
                           try
                           {
                                await staffMembers.findByIdAndUpdate({_id:sloty.staffTeachingSlot},{$pull: {scheduleSlots:theSlot._id}})  
                           }
                           catch(err)
                           {
                               console.log(err)
                           }
                            var sloty=await slot.findOneAndUpdate({_id:theSlot._id},{staffTeachingSlot:null}, {new: true})
                            //add
                            sloty=await slot.findOneAndUpdate({_id:theSlot._id},{staffTeachingSlot:theAcademicUser._id}, {new: true})
                            await staffMembers.findByIdAndUpdate({_id:theAcademicUser._id},{$push: {scheduleSlots:theSlot._id}})  
                            const result=
                            {
                                startTime: sloty.startTime,
                                endTime: sloty.endTime,
                                courseTaughtInSlot: myCourse.name,
                                staffTeachingSlot: theAcademicUser.name,
                            }
                            res.send(result)
                        }
                   }
                }
           
            }
        }
        catch(err)
        {
            console.log(err)
        }
    });

 //  delete assignment of academic member in course(s) he/she is assigned to.
    router.route("/delete-assign/:course")
    .post(
        [check ("slotID").isString().isLength(24)],
        async(req,res) =>{
            try
        {
            const myCourse= await course.findOne({"courseName":req.params.course});
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                   const theSlot = await slot.findOne({_id:req.body.slotID});
                   if(theSlot==null || !theSlot.courseTaughtInSlot.equals(myCourse._id))
                   {
                       res.status(401).send("You cannot assign this slot to anyone")
                   }
                   else
                   {
                        await course.findOneAndUpdate({_id:myCourse._id},{unassignedSlots:myCourse.unassignedSlots+1}, {new: true})
                        try
                        {
                            await staffMembers.findByIdAndUpdate({_id:sloty.staffTeachingSlot},{$pull: {scheduleSlots:theSlot._id}})  
                        }
                        catch(err)
                        {
                            console.log(err);
                        }
                        const sloty=await slot.findOneAndUpdate({_id:theSlot._id},{staffTeachingSlot:null}, {new: true})
                        const result=
                        {
                            startTime: sloty.startTime,
                            endTime: sloty.endTime,
                            courseTaughtInSlot: myCourse.name,
                            staffTeachingSlot: "N/A",
                        }
                    res.send(result)
                   }
                }
           
            }
        }
        catch(err)
        {
            console.log(err)
        }
            });
    
    //Remove an assigned academic member in course(s) he/she is assigned to.
    router.route("/remove-academicMember/:course/:id")
    .post(
        async(req,res) =>{
            try
        {
            const myCourse= await course.findOne({"courseName":req.params.course});
            console.log(myCourse)
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                   const theAcademicUser = await staffMembers.findOne({id:req.params.id});
                   if(theAcademicUser==null)
                   {
                       res.status(404).send("The academic user that you are trying to remove from your course does not exist.")
                   }
                   else
                   {
                        //check if he's in the course
                        const coursesOfAcademicUser = theAcademicUser.courses;
                        var foundIt=false;
                        if(coursesOfAcademicUser!=null)
                        {
                            for (const element of coursesOfAcademicUser)
                            {
                                const temp=(myCourse.courseName)
                                if(temp.equals(element))
                                {
                                    foundIt=true;break;
                                }
                            }
                        }
                        if(!foundIt)
                        {
                            res.status(404).send("The user that you are trying to remove from your course is not part of the course")
                        }
                        else
                        {
                            await course.findByIdAndUpdate({_id:myCourse._id},{$pull: {instructors:theAcademicUser._id}}) 
                            await course.findByIdAndUpdate({_id:myCourse._id},{$pull: {teachingAssistants:theAcademicUser._id}}) 
                            try
                            {
                                if(theAcademicUser.id.equals(myCourse._id.coordinator)) 
                                {
                                    await course.findByIdAndUpdate({_id:myCourse_id},{coordinator:null}) 
                                }
                            }
                            catch(err)
                            {
                                console.log(err);
                            }
                            await staffMembers.findByIdAndUpdate({_id:theAcademicUser._id},{$pull: {courses:myCourse.courseName}}) 
                            const courseSlots= myCourse.teachingSlots;
                            if(courseSlots!=null)
                            {
                            for (const elem of courseSlots)
                            {
                                const theSLot= await slot.findOne({_id:elem});
                                try
                                {
                                    if(theSlot.staffTeachingSlot.equals(theAcademicUser._id))
                                    {
                                        await slot.findByIdAndUpdate({_id:theSLot._id},{staffTeachingSlot:null}) 
                                        await staffMembers.findByIdAndUpdate({_id:theAcademicUser},{$pull: {scheduleSlots:theSLot._id}}) 
                                        await course.findByIdAndUpdate({_id:myCourse._id},{unassignedSlots:myCourse.unassignedSlots+1}) ;
                                    }
                                }
                                catch(err)
                                {
                                    console.log(err);
                                }
                            }
                        }
                        res.send("User removed from course succesfully")
                        }
                   }
                }
           
            }
        }
        catch(err)
        {
            console.log(err)
        }
            });
        
//Assign an academic member in each of his/her course(s) to be a course coordinator.
router.route("/assign-academic/:course")
.post(
     [
       check("academicID", "Invalid data type. userID must be of type string of length 24").isString().isLength(24)
    ]
    ,async(req,res) =>{
        try {
            const userID=req.user.id;
            const user = await staffMembers.findOne({id:userID})
            const academicID=req.body.academicID
            const myCourse= await course.findOne({"courseName":req.params.course});
            if(myCourse==null)
            {
                res.status(404).send("Course not found!")
            }
            else
            {
                const instructorId=req.user.id;
                const instructor= await staffMembers.findOne({id:instructorId});
                const intructorsList = myCourse.instructors;
                var found=false;
                if(intructorsList!=null)
                {
                    for (const element of intructorsList)
                    {
                        if(element.equals(instructor._id))
                        {
                            found=true;
                        }
                    }
                }
                if(!found)
                {
                    res.status(401).send("User is not an instructor or is not an instructor of that course")
                }
                else
                {
                    const coordinator1 = await staffMembers.findOne({id:academicID})
                    if(coordinator1==null)
                    {
                        res.status(404).send("coordinator doesn't exist")
                    }
                   else if(coordinator1._id.equals(await course.findOne({coordinator:user}))){
                        res.status(404).send("already a coordinator")
                    }
                    else{
                        const taList = myCourse.teachingAssistants;
                        var found2=false;
                        if(taList!=null)
                         {
                            for (const element of taList)
                            {       
                                if(element.equals(coordinator1._id))
                                {
                                    found2=true;
                                }
                            }
                        }
                         if(!found2)
                        {
                             res.status(401).send("The user that you want to assign as a coordinator is not a TA in this course")
                        }
                        const result = await course.findByIdAndUpdate(_id=myCourse._id,{coordinator:coordinator1._id})
                        const display=
                        {
                            "courseName":result.courseName,
                            "coordinator":coordinator1.name,
                            "unassignedSlots":result.unassignedSlots,
                        }
                        res.send(display);
                    }
                }
           
            }
        }
   catch(err){
        console.error(err.message);
            res.status(500).send("Server Error");
    }
    });


 router.get("/courses", async (req, res) => {
        try {
            //Get the Logged in User's department
            let userCode = req.user.id;
            let currentUser = await staffMembers.findOne({"id": userCode});
            let depart = await department.findOne({"departmentName" : currentUser.departmentName});
          
                let coursesOutput = [];
                for(let i=0;i<depart.courses.length;i++){
                    crs = await course.findOne({"_id": ObjectId(depart.courses[i])})
                    coursesOutput.push({courseName: crs.courseName})
                //                console.log(coursesOutput)
                }
                return coursesOutput;

    
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

//View Unassigned slots per course
router.route("/unassigned/:course")
.get( async (req, res) => {
    var ObjectId = require('mongodb').ObjectId; 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        const myCourse= await course.findOne({"courseName":req.params.course});
        if(myCourse==null)
        {
            res.status(404).send("Course not found!")
        }
        else
        {   const unassignedslotsarray =[]
            const teachingSlots = myCourse.teachingSlots;
           
                for (const element of teachingSlots)
                {
                    if(element.staffTeachingSlot.equals(null))
                    {
                        unassignedslotsarray.push(element )
                    }
                 }
                 res.send(unassignedslotsarray)
           } 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



//View assigned slots per course
router.route("/assignedslots/:course")
.get( async (req, res) => {
    var ObjectId = require('mongodb').ObjectId; 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })}
    try {
        const myCourse= await course.findOne({"courseName":req.params.course});
        if(myCourse==null)
        {
            res.status(404).send("Course not found!")
        }
        else
        {   const assignedslotsarray =[]
            const teachingSlots = myCourse.teachingSlots;
           
                for (const element of teachingSlots)
                {
                    if(!element.staffTeachingSlot.equals(null))
                    {
                        assignedslotsarray.push(element )
                    }
                 }
                 res.send(assignedslotsarray)
           } 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//.catch((err)=>{console.log(err)})
module.exports=router;