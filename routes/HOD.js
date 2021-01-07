const express = require('express');
const router = express.Router();
const departmentModel = require('../models/department');
const requestModel = require('../models/request');
const courseModel = require('../models/course');
const slotModel = require('../models/slot');
const locationModel = require('../models/location');
const staffModel = require('../models/staffMembers');
const { check, validationResult } = require("express-validator");
const { ObjectId } = require('mongodb');
const e = require('express');



//Done ==> 7
//Work In Progress ==> 1
//Untouched ==> 4

// @status  Done & Tested
// @route   POST api/HOD/assign-instr-course
// @input   courseId, instructorId
// @desc    Assign a course instructor for each course in his department.
// @access  Private
router.post("/assign-instr-course",
[
  check("courseId", "Course Id incorrect <backend problem>").isLength(24),
  check("instructorId", "Instructor Id incorrect <backend problem>").isLength(24)
]
, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

            if(instr){//check instructor under department
                if (depart.courses.includes(ObjectId(req.body.courseId))){ //check course under department
                    course1 = await courseModel.findOne({_id: ObjectId(req.body.courseId)});
                    if (!(course1.instructors.includes(ObjectId(req.body.instructorId)))){
                        instrArray = course1.instructors;
                        instrArray.push(ObjectId(req.body.instructorId))
                        await courseModel.findOneAndUpdate({_id: ObjectId(req.body.courseId)},{
                            "instructors": instrArray
                        })
                    }
                    else{
                        res.status(400).send("Instructor is already assigned to course")
                    }
                    
                    if (!(instr.courses.includes(course1.courseName))){
                        let coursesArray = instr.courses
                        coursesArray.push(course1.courseName)
                        await staffModel.findOneAndUpdate({_id: ObjectId(req.body.instructorId)},{ 
                            "courses" : coursesArray
                        })
                    }
                    else{
                        res.status(400).send("Course is already assigned to instructor, but instructor not assigned to course")
                    }
                    res.status(200).send("HOD user: "+currentUser.name+" made change: instructor " + instr.name + " is now assigned to course "+ course1.courseName);   
                } 
                else{
                    res.status(400).send("Course is not under this department or does not exist")
                 }
            }
            else{
                res.status(400).send("Staff member is not under this department or does not exist")
            }
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   DELETE api/HOD/assign-instr-course
// @input   courseId, instructorId
// @desc    delete a course instructor for each course in his department.
// @access  Private
router.delete("/del-instr-course",[
    check("courseId", "Course Id incorrect <backend problem>").isLength(24),
    check("instructorId", "Instructor Id incorrect <backend problem>").isLength(24)
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

            if(instr){//check instructor under department
                if (depart.courses.includes(ObjectId(req.body.courseId))){ //check course under department
                    course1 = await courseModel.findOne({_id: ObjectId(req.body.courseId)});
                    if ((course1.instructors.includes(ObjectId(req.body.instructorId)))){
                        instrArray = course1.instructors;
                        let idx = instrArray.indexOf(ObjectId(req.body.instructorId))
                        instrArray.splice(idx,1)
                        await courseModel.findOneAndUpdate({_id: ObjectId(req.body.courseId)},{
                            "instructors": instrArray
                        })
                    }
                    else{res.status(400).send("Instructor is not assigned to course")}
                    
                    if ((instr.courses.includes(course1.courseName))){
                        let coursesArray = instr.courses
                        let idx = coursesArray.indexOf(course1.courseName)
                        coursesArray.splice(idx,1)
                        await staffModel.findOneAndUpdate({_id: ObjectId(req.body.instructorId)},{"courses" : coursesArray})
                    }
                    else{res.status(400).send("Course is not assigned to instructor, but instructor is assigned to course")}
                    res.status(200).send("HOD user: "+currentUser.name+" made change: instructor " + instr.name + " is now removed from course "+ course1.courseName);   
                } 
                else{res.status(400).send("Course is not under this department or does not exist")}
            }
            else{
                res.status(400).send("Staff member is not under this department or does not exist")
            }
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   POST api/HOD/update-instr-course
// @input   courseId, instructorId
// @desc    Update a course instructor(overwrites all other instructors, only this one remains)
// @access  Private
router.post("/update-instr-course",[
    check("courseId", "Course Id incorrect <backend problem>").isLength(24),
    check("instructorId", "Instructor Id incorrect <backend problem>").isLength(24)
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

            if(instr){//check instructor under department
                if (depart.courses.includes(ObjectId(req.body.courseId))){ //check course under department
                    course1 = await courseModel.findOne({_id: ObjectId(req.body.courseId)});
                    for(i=0;i<course1.instructors.length;i++){
                        //res.json(course1.instructors[i])
                        let instructorMan= await staffModel.findOne({_id: ObjectId(course1.instructors[i])})
                        instructorManCourses = instructorMan.courses;
                        const index = instructorManCourses.indexOf(ObjectId(course1._id))
                        instructorManCourses.splice(index,1)
                        await staffModel.findOneAndUpdate({_id: ObjectId(course1.instructors[i])},{ 
                            "courses" : instructorManCourses
                        })
                    }
                    instrArray = [ObjectId(req.body.instructorId)];
                    await courseModel.findOneAndUpdate({_id: ObjectId(req.body.courseId)},{
                        "instructors": instrArray
                    })
                    
                    let coursesArray = [course1.courseName];
                    await staffModel.findOneAndUpdate({_id: ObjectId(req.body.instructorId)},{ 
                        "courses" : coursesArray
                    })
                    
                    res.status(200).send("HOD user: "+currentUser.name+" made change: instructor " + instr.name + " is now assigned to course "+ course1.courseName + " (Overwritingly)");   
                } 
                else{
                    res.status(400).send("Course is not under this department or does not exist")
                 }
            }
            else{
                res.status(400).send("Staff member is not under this department or does not exist")
            }
          }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/staff
// @input   -
// @desc    View all staff members (View their Ids? or all info??)
// @access  Private
router.get("/staff", async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentName" : depart.departmentName});
        let staffOutput = [];
        staff.forEach(staffMem => staffOutput.push({
            userCode: staffMem.id,
            email: staffMem.email,
            name: staffMem.name
        }))
        res.status(200).json(staffOutput)
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/staff-crs
// @input   courseId  
// @desc    View one staff members
// @access  Private
router.get("/staff-crs",[
    check("courseId", "Course Id incorrect <backend problem>").isLength(24)
  ]
  ,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentName" : depart.departmentName});
        let course = await courseModel.findOne({"_id" : ObjectId(req.body.courseId)})
        staff = staff.filter((x) => x.courses.includes(course.courseName))
        let staffOutput = [];
        staff.forEach(staffMem => staffOutput.push({
            userCode: staffMem.id,
<<<<<<< Updated upstream
=======
            subType: staffMem.subType,
>>>>>>> Stashed changes
            email: staffMem.email,
            name: staffMem.name
        }))
        res.status(200).json(staffOutput)
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/staff-do
// @input   -
// @desc    View the day off of all the staff in his/her department.
// @access  Private
router.get("/staff-do",  async (req, res) => {

    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentName" : depart.departmentName});
        let staffOutput = [];
        staff.forEach(staffMem => staffOutput.push({
            id : staffMem.id,
            staffMemberName: staffMem.name,
            dayOff: staffMem.dayOff,
        }))
        res.status(200).json(staffOutput)
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/staff-dos
// @input   staff member id  
// @desc    View the day off of a single staff in his/her department.
// @access  Private
router.get("/staff-dos",[
    check("staffId", "Staff Id incorrect <backend problem>").isLength(24)
  ]
  ,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
        //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.findOne({"_id": ObjectId(req.body.staffId),"departmentName" : depart.departmentName});
        let staffMem = {
            id : staff.id,
            staffMemberName: staff.name,
            dayOff: staff.dayOff
        }
        res.status(200).json(staffMem)
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/leave-reqs
// @input   -
// @desc    View all the requests “change day off/leave” sent by staff members 
//          in his/her department
// @access  Private
router.get("/leave-do-reqs", async (req, res) => {
    try {
         //Get the Logged in User's department
         let userCode = req.user.id;
         let currentUser = await staffModel.findOne({"id": userCode});
         let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
         //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let staff = await staffModel.find({"departmentName" : depart.departmentName});
            let requestsAcc = [];
            let leavesOutput = [];
                
            //for Each staff member get their requests
            staff.forEach(staffMem => 
                staffMem.sentRequests.forEach(requestId => requestsAcc.push(requestId))
            )
            
            //Now we have all the request Ids, we need to filter out the ones that are leave/change day off
            for(let i = 0; i<requestsAcc.length;i++){
                let requesto = await requestModel.findOne({"_id":ObjectId(requestsAcc[i])}) 
                
                if(requesto){
                    if((requesto.requestType === "annual leave" ||
                    requesto.requestType === "maternal leave" ||
                    requesto.requestType === "accidental leave" ||
                    requesto.requestType === "sick leave" ||
                    requesto.requestType === "compenation leave" ||
                    requesto.requestType === "change day off")){
                        
                        let reciever = await staffModel.findOne({_id: ObjectId(requesto.recieverID)})
                        let sender = await staffModel.findOne({_id: ObjectId(requesto.senderID)})
                        if(reciever && sender){
                            let leavesOutputItem = {
                                requestId : requesto._id, 
                                reqSenderId : sender.id, 
                                reqSenderName : sender.name,
                                reqRecieverId : reciever.id,
                                reqRecieverName : reciever.name,
                            }
                            if(requesto.requestReason){leavesOutputItem.requestReason =requesto.requestReason }
                            if(requesto.status){leavesOutputItem.status =requesto.status }
                            if(requesto.rejectionReason){leavesOutputItem.rejectionReason =requesto.rejectionReason }
                            if(requesto.relaventDocuments){leavesOutputItem.relaventDocuments =requesto.relaventDocuments }
                            if(requesto.DesiredDayoff){leavesOutputItem.DesiredDayoff =requesto.DesiredDayoff }
                            if(requesto.startOfLeave){leavesOutputItem.startOfLeave =requesto.startOfLeave }
                            if(requesto.endOfLeave){leavesOutputItem.endOfLeave =requesto.endOfLeave }
                            if(requesto.replacementSlot){leavesOutputItem.replacementSlot =requesto.replacementSlot }
                            leavesOutput.push(leavesOutputItem)
                        }
                        else{
                            res.status(400).send("Request's reciever or sender are unidentified")
                        }
                    }
                }
                else{
                    res.status(400).send("Request with that ID not found")
                }
            }
            res.status(200).json(leavesOutput)

        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Untouched
// @route   POST api/hod/leave-req-a
// @input   reqId
// @desc    Accept a request. if a request is accepted, appropriate logic should be
//          executed to handlethis request.
// @access  Private
router.post("/leave-do-req-a",[
    check("reqId", "Request Id incorrect <backend problem>").isLength(24)
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
        //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let request = await requestModel.findOne({"_id":ObjectId(req.body.reqId)});
            if(request){
                await requestModel.findOneAndUpdate({"_id":ObjectId(req.body.reqId)} , {"status": "accepted", "rejectionReason" : null})
             }
            else{
                res.status(400).send("Request not found")
            }
            res.status(200).send("Request Acceptance successful!") 
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department!")
        }


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})
//=========================================================================//

// @status  Untouched
// @route   POST api/hod/leave-req-r
// @input   reqId, reqRejectReason
// @desc    Reject a request, and optionally leave a comment as to why this
//          request was rejected
// @access  Private
router.post("/leave-do-req-r",[
    check("reqId", "Request Id incorrect <backend problem>").isLength(24),
    check("reqRejectReason", "invalid Reject Reason<backend problem>").optional().isString()
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName": currentUser.departmentName});
        //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let request = await requestModel.findOne({"_id":ObjectId(req.body.reqId)});
            if(request){
                await requestModel.findOneAndUpdate({"_id":ObjectId(req.body.reqId)} , {"status": "rejected"})
                
                if (req.body.reqRejectReason){await requestModel.findOneAndUpdate({"_id":ObjectId(req.body.reqId)} , {"rejectionReason": req.body.reqRejectReason})}
            }
            else{
                res.status(400).send("Request not found")
            }
            res.status(200).send("Request Rejection successful!") 
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department!")
        }


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Untouched
// @route   GET api/hod/course-cov
// @input   course-Id
// @desc    View the coverage of each course in his/her department
// @access  Private
router.get("/course-cov", [
    check("courseId", "Course Id incorrect <backend problem>").isLength(24)
  ]
  ,  async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let course = await courseModel.findOne({"_id" : ObjectId(req.body.courseId)});
            if(course){
                if(course.unassignedSlots!=null){ 
                    if(course.teachingSlots.length!=0){
                        let CourseCov = ((course.teachingSlots.length-course.unassignedSlots)/  course.teachingSlots.length)
                        
                        res.status(200).json("course " +course.courseName+" has coverage "+ CourseCov*100 +"%, and "+course.unassignedSlots+" unassigned slots")
                    }
                    else{res.status(400).send("Course has no teaching slots")}
                }
                else{
                    res.status(400).send("UnassignedSlots value is null")
                }
                
            }
            else{res.status(400).send("course not found")}   
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

<<<<<<< Updated upstream
// @status  Untouched
=======
// @status  Done & Tested
>>>>>>> Stashed changes
// @route   GET api/hod/teaching-assignments
// @input   courseId  
// @desc    View teaching assignments (which staff members teach which slots) 
//          of course offered by his department.
// @access  Private
router.get("/teaching-assignments",[
<<<<<<< Updated upstream
    check("courseId", "Course Id incorrect <backend problem>").isLength(24)
=======
    check("courseName", "Course name needed")
>>>>>>> Stashed changes
  ]
  ,  async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let course = await courseModel.findOne({"_id" : ObjectId(req.body.courseId)});
            let printable = [];
            if(course){
                for (let i=0; i<course.teachingSlots.length;i++){
                    let slot = await slotModel.findOne(ObjectId(course.teachingSlots[i]))
                    
                    if(slot){
                        let printableTemp = {
                            slotId : slot._id, 
                            startTime: slot.startTime,
                            endTime: slot.endTime, 
                        }
                        if(slot.slotLocation){
                            let Loc = await locationModel.findOne({"_id":ObjectId(slot.slotLocation)})
                            if(Loc){printableTemp.location = Loc.roomNr;}
                            else{
                                res.status(400).send("Location was not found")
                            }
                        }
                        if(slot.staffTeachingSlot){
                            let staffMem = await staffModel.findOne({"_id":ObjectId(slot.staffTeachingSlot)})
                            if(staffMem){
                                printableTemp.isAssigned = true,
                                printableTemp.staffTeachingSlotId = staffMem.id,
                                printableTemp.staffTeachingSlotName = staffMem.name
                            }
                            else{
                                res.status(400).send("Staff teaching course was not found")
                            }
                        }
                        else{
                            printableTemp.isAssigned = false
                        }
                        printable.push(printableTemp)
                    }
                    else{console.log("A slot was not found in Database")}
                }
                res.json(printable)
            }
            else{res.status(400).send("course not found")}   
        }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

<<<<<<< Updated upstream
=======
router.get("/courses", async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let coursesOutput = [];
            depart.courses.forEach(async course =>{
                crs = await courseModel.findOne({"_id": ObjectId(course)})
                coursesOutput.push({coursename: crs.courseName})
            }
            )
            res.status(200).json(coursesOutput)
            }
        else{
            res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
>>>>>>> Stashed changes


module.exports = router;