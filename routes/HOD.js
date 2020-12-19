const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const departmentModel = require('../models/department');
const courseModel = require('../models/course');
const staffModel = require('../models/staffMembers');
const { check, validationResult } = require("express-validator");
const { Server, ObjectId } = require('mongodb');


//Done ==> 7
//Work In Progress ==> 0
//Untouched ==> 5

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
,
auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentId" : depart._id , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

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
                    
                    if (!(instr.courses.includes(ObjectId(req.body.courseId)))){
                        let coursesArray = instr.courses
                        coursesArray.push(ObjectId(req.body.courseId))
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
// @input   course id, instructor id
// @desc    delete a course instructor for each course in his department.
// @access  Private
router.delete("/del-instr-course", auth, async (req, res) => {
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentId" : depart._id , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

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
                    
                    if ((instr.courses.includes(ObjectId(req.body.courseId)))){
                        let coursesArray = instr.courses
                        let idx = coursesArray.indexOf(ObjectId(req.body.courseId))
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
// @input   course id, instructor id
// @desc    Update a course instructor(overwrites all other instructors, only this one remains)
// @access  Private
router.post("/update-instr-course", auth, async (req, res) => {
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            //Find instructor
            let instr = await staffModel.findOne({"departmentId" : depart._id , "type":"instructor", "_id": ObjectId(req.body.instructorId)});

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
                    
                    let coursesArray = [ObjectId(req.body.courseId)];
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
router.get("/staff", auth, async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentId" : depart._id});
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
router.get("/staff-crs", auth, async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentId" : depart._id});
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
router.get("/staff-do", auth, async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.find({"departmentId" : depart._id});
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
router.get("/staff-dos", auth, async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({_id : currentUser.departmentId});
        //check if user is head of the department
        if (depart.HOD_id.toString() == currentUser._id.toString()){
        let staff = await staffModel.findOne({"_id": ObjectId(req.body.staffId),"departmentId" : depart._id});
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

// @status  Untouched
// @route   GET api/hod/leave-reqs
// @input   -
// @desc    View all the requests “change day off/leave” sent by staff members 
//          in his/her department
// @access  Private
router.get("/leave-reqs", auth, async (req, res) => {
    try {
         //Get the Logged in User's department
         let userCode = req.user.id;
         let currentUser = await staffModel.findOne({"id": userCode});
         let depart = await departmentModel.findOne({_id : currentUser.departmentId});
         //check if user is head of the department
         if (depart.HOD_id.toString() == currentUser._id.toString()){


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
// @input   req-id
// @desc    Accept a request. if a request is accepted, appropriate logic should be
//          executed to handlethis request.
// @access  Private
router.post("/leave-req-a", auth, async (req, res) => {
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
// @input   req-id
// @desc    Reject a request, and optionally leave a comment as to why this
//          request was rejected
// @access  Private
router.post("/leave-req-r", auth, async (req, res) => {
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
// @input   course-id
// @desc    View the coverage of each course in his/her department
// @access  Private
router.get("/course-cov", auth, async (req, res) => {
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
// @input   course-id  
// @desc    View teaching assignments (which staff members teach which slots) 
//          of course offered by his department.
// @access  Private
router.get("/teaching-assignments", auth, async (req, res) => {
    try {
        //Get the Logged in User's department
        const department = await departmentModel.findOne({HOD_id : req.user.id});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



module.exports = router;