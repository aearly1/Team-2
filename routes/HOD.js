const express = require('express');
const router = express.Router();
//const auth = require("../middleware/auth");
const departmentModel = require('../models/department');
const requestModel = require('../models/request');
const courseModel = require('../models/course');
const staffModel = require('../models/staffMembers');
const { check, validationResult } = require("express-validator");
const { Server, ObjectId } = require('mongodb');
const { request } = require('express');



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
                    res.status(200).send("hod user: "+currentUser.name+" made change: instructor " + instr.name + " is now assigned to course "+ course1.courseName);   
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
                    res.status(200).send("hod user: "+currentUser.name+" made change: instructor " + instr.name + " is now removed from course "+ course1.courseName);   
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
                    
                    res.status(200).send("hod user: "+currentUser.name+" made change: instructor " + instr.name + " is now assigned to course "+ course1.courseName + " (Overwritingly)");   
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
        staff = staff.filter((x) => x.courses.includes(ObjectId(req.body.courseId)))
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
// @route   GET api/hod/staff-do
// @input   -
// @desc    View the day off of all the staff in his/her department.
// @access  Private
router.get("/staff-do",  async (req, res) => {
    console.log("you have reached staff-do")
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

// @status  WIP
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
            for(let i = 0; i<requestsAcc.length;i++){
                let requests1 = await requestModel.findOne({"_id":ObjectId(requestsAcc[i])}) 
                if(request1){
                let reciever = await staffModel.findOne({"_id": ObjectId(requests1.recieverID)})
                let sender = await staffModel.findOne({"_id": ObjectId(requests1.senderId)})
                leavesOutput.push({
                    requestId : request1._id,
                    reqSender : sender._id,
                    reqreciever : reciever._id
                })
                }
                else{
                    res.status(400).send("Request with that ID not found")
                }
            }
            // requestsAcc.forEach(async requestId => {
            //     let reciever = await staffModel.findOne({"_id": ObjectId(requests1.recieverID)})
            //     res.json(requests1)
            // })
                    // {
                    // //for each request, find it in the DB, and add its info to printables
                    
                    // let requests1 = await requestModel.findOne({"_id":ObjectId(requestId)}) 
                    // let reciever = await staffModel.findOne({"_id": ObjectId(requests1.recieverID)})
                    // res.json(request1) 
                    
                    // if (requests1){
                    //     if((requests1.requestType == "change day off") | (requests1.requestType == "leave")){
                    //         let leavesOutputItem = {
                    //             sendName: staffMem.name,
                    //             senderID: staffMem.id,
                    //             recieverName: reciever.name,
                    //             recieverID: reciever.id,
                    //             type:requestType,
                    //             status:requests1.status,
                    //         }
                    //         if(requests1.requestReason){leavesOutputItem.requestReason= requests1.requestReason}
                    //         if(requests1.rejectionReason){leavesOutputItem.rejectionReason= requests1.rejectionReason}
                    //         leavesOutput.push(leavesOutputItem)
                    //     }}}))
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
router.post("/leave-req-a",[
    check("reqId", "Request Id incorrect <backend problem>").isLength(24)
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        const department = await departmentModel.findOne({HOD_id : req.user.id});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Untouched
// @route   POST api/hod/leave-req-r
// @input   reqId, reqRejectReason
// @desc    Reject a request, and optionally leave a comment as to why this
//          request was rejected
// @access  Private
router.post("/leave-req-r",[
    check("reqId", "Request Id incorrect <backend problem>").isLength(24),
    check("reqRejectReason", "Request Id incorrect <backend problem>").optional().isEmpty()
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        const department = await departmentModel.findOne({HOD_id : req.user.id});
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
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        const department = await departmentModel.findOne({HOD_id : req.user.id});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Untouched
// @route   GET api/hod/teaching-assignments
// @input   courseId  
// @desc    View teaching assignments (which staff members teach which slots) 
//          of course offered by his department.
// @access  Private
router.get("/teaching-assignments",[
    check("courseId", "Course Id incorrect <backend problem>").isLength(24)
  ]
  , async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
        //Get the Logged in User's department
        const department = await departmentModel.findOne({HOD_id : req.user.id});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



module.exports = router;