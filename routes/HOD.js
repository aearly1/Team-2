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



//Done ==> 12
//Work In Progress ==> 0
//Untouched ==> 0

// @status  Done & Tested
// @route   POST api/HOD/assign-instr-course
// @input   courseId, instructorId
// @desc    Assign a course instructor for each course in his department.
// @access  Private
router.post("/assign-instr-course",
[
  check("courseName", "Course Name needed."),
  check("instructorId", "Instructor Id needed.")
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
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName, "subType":"instructor" , "id": req.body.instructorId});

            if(instr){//check instructor under department
                course1 = await courseModel.findOne({courseName: req.body.courseName});
                if(course1){
                    if (depart.courses.includes(ObjectId(course1._id))){ //check course under department
                        if (!(course1.instructors.includes(ObjectId(instr._id)))){
                            instrArray = course1.instructors;
                            instrArray.push(ObjectId(instr._id))
                            await courseModel.findOneAndUpdate({"courseName": req.body.courseName},{
                                "instructors": instrArray
                            })
                        }
                        else{
                            res.status(400).send("Instructor is already assigned to course.")
                        }
                        
                        if (!(instr.courses.includes(course1.courseName))){
                            let coursesArray = instr.courses
                            coursesArray.push(course1.courseName)
                            await staffModel.findOneAndUpdate({"id": req.body.instructorId},
                            { 
                                "courses" : coursesArray
                            })
                        }
                        else{
                            res.status(400).send("Error : Course is already assigned to instructor, but instructor not assigned to course.")
                        }
                        res.status(200).send("HOD user: "+currentUser.name+" made change ==> instructor " + instr.name + " is now assigned to course "+ course1.courseName + ".");   
                    }
                    
                    else{
                        res.status(400).send("Error : Course is not under this department.")
                    }
                }
                else{
                    res.stutus(400).send("Error : Course not found.")
                }
            }
            else{
                res.status(400).send("Error : Staff member is not under this department, is not an instructor, or does not exist.")
            }
        }
        else{
            res.status(401).send("Error : Unauthorized. User is not head of his department.")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error : Server Error.");
    }
});
//=========================================================================//

///CHANGED DURING FRONTEND DEV
// @status  Done & Tested
// @route   POST api/HOD/assign-instr-course
// @input   courseId, instructorId
// @desc    delete a course instructor for each course in his department.
// @access  Private
router.post("/del-instr-course",[
    check("courseName", "Course Name needed."),
    check("instructorId", "Instructor Id needed.")
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
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName , "subType":"instructor", "id": req.body.instructorId});

            if(instr){//check instructor under department
                course1 = await courseModel.findOne({courseName: req.body.courseName});
                if(course1){
                    if (depart.courses.includes(ObjectId(course1._id))){ //check course under department
                        
                        if ((course1.instructors.includes(ObjectId(instr._id)))){
                            instrArray = course1.instructors;
                            let idx = instrArray.indexOf(ObjectId(instr._id))
                            instrArray.splice(idx,1)
                            await courseModel.findOneAndUpdate({_id: ObjectId(course1._id)},{
                                "instructors": instrArray
                            })
                        }
                        else{res.status(400).send("Error : Instructor is not assigned to course.")}
                        
                        if ((instr.courses.includes(course1.courseName))){
                            let coursesArray = instr.courses
                            let idx = coursesArray.indexOf(course1.courseName)
                            coursesArray.splice(idx,1)
                            await staffModel.findOneAndUpdate({_id: ObjectId(instr._id)},{"courses" : coursesArray})
                        }
                        else{
                            res.status(400).send("Error : Course is not assigned to instructor, but instructor is assigned to course.")
                        }
                        res.status(200).send("HOD user: "+currentUser.name+" made change ==> instructor " + instr.name + " is now removed from course "+ course1.courseName + ".");   
                    } 
                    else{
                        res.status(400).send("Error : Course is not under this department.")
                    }
                }
                else{
                    res.stutus(400).send("Error : Course not found.")
                }       
            }
            else{
                res.status(400).send("Error : Staff member is not under this department, is not an instructor, or does not exist.")
            }
        }
        else{
            res.status(401).send("Error : Unauthorized. User is not head of his department.")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error : Server Error.");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   POST api/HOD/update-instr-course
// @input   courseId, instructorId
// @desc    Update a course instructor(overwrites all other instructors, only this one remains)
// @access  Private
router.post("/update-instr-course",[
    check("courseName", "Course Name needed"),
    check("instructorId", "Instructor Id needed")
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
            let instr = await staffModel.findOne({"departmentName" : depart.departmentName , "subType":"instructor", "id": req.body.instructorId});

            if(instr){//check instructor under department
                course1 = await courseModel.findOne({courseName: req.body.courseName});
                if(course1){
                    if (depart.courses.includes(ObjectId(course1._id))){ //check course under department
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
                        instrArray = [ObjectId(instr._id)];
                        await courseModel.findOneAndUpdate({_id: ObjectId(course1._id)},{
                            "instructors": instrArray
                        })
                        
                        let coursesArray = [course1.courseName];
                        await staffModel.findOneAndUpdate({_id: ObjectId(instr._id)},{ 
                            "courses" : coursesArray
                        })
                        
                        res.status(200).send("HOD user: "+currentUser.name+" made change ==> instructor " + instr.name + " is now assigned to course "+ course1.courseName + " (Overwritingly).");   
                    } 
                    else{
                        res.status(400).send("Error : Course is not under this department.")
                    }
                }
                else{
                    res.stutus(400).send("Error : Course not found.")
                }
            }
            else{
                res.status(400).send("Error : Staff member is not under this department, is not an instructor, or does not exist.")
            }
          }
        else{
            res.status(401).send("Error : Unauthorized. User is not head of his department.")
        }
        //res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error : Server Error.");
    }
});
//=========================================================================//

// @status  Done & Tested
// @route   GET api/hod/staff
// @input   -
// @desc    View all staff members
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
                imgLink: staffMem.imgLink,
                subType: staffMem.subType,
                email: staffMem.email,
                name: staffMem.name
            }))
            
            staffOutput.forEach(idx => {if(idx.userCode==userCode){ idx.subType="head of department"} })
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


///CHANGED DURING FRONTEND DEV
// @status  Done & Tested
// @route   POST api/hod/staff-crs
// @input   courseName
// @desc    View a course's teaching staff
// @access  Private
router.post("/staff-crs",[
    check("courseName", "Course Name incorrect <backend problem>").not().isEmpty()
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
        let course = await courseModel.findOne({"courseName" : req.body.courseName})
        staff = staff.filter((x) => x.courses.includes(course.courseName))
        let staffOutput = [];
        staff.forEach(staffMem => staffOutput.push({
            userCode: staffMem.id,
            imgLink: staffMem.imgLink,
            subType: staffMem.subType,
            email: staffMem.email,
            name: staffMem.name
        }))
        
        staffOutput.forEach(idx => {if(idx.userCode==userCode){ idx.subType="head of department"} })
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
            subType: staffMem.subType,
            dayOff: staffMem.dayOff,
        }))
        staffOutput.forEach(idx => {if(idx.id==userCode){ idx.subType="head of department"} })
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


///CHANGED DURING FRONTEND DEV
// @status  Done & Tested
// @route   POST api/hod/staff-dos
// @input   staff member id  
// @desc    View the day off of a single staff in his/her department.
// @access  Private
router.post("/staff-dos",[
    check("staffId", "Staff Id needed")
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
            
            let staff = await staffModel.findOne({"id": req.body.staffId,"departmentName" : depart.departmentName});
            if(staff){
                let staffMem = {
                    id : staff.id,
                    staffMemberName: staff.name,
                    subType: staff.subType,
                    dayOff: staff.dayOff
                }
                if (staffMem.id==userCode){ staffMem.subType = "head of department"}
                res.status(200).json(staffMem)
            }
            else{
                res.status(400).send("Staff member with that id not found under your department.")
            }
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
                    requesto.requestType === "compensation leave" ||
                    requesto.requestType === "change day off")){
                        //relaventDocuments --> relevantLeaveDocuments
                        let reciever = await staffModel.findOne({_id: ObjectId(requesto.recieverID)})
                        let sender = await staffModel.findOne({_id: ObjectId(requesto.senderID)})
                        if(reciever && sender){
                            let leavesOutputItem = {
                                "id" : requesto._id, 
                                "RequestType" :requesto.requestType,
                                "reqSenderId" : sender.id, 
                                "Sender" : sender.name,
                                "reqRecieverId": reciever.id,
                                "Reciever" : reciever.name,
                            }
                            if(requesto.requestReason){leavesOutputItem.requestReason =requesto.requestReason }
                            if(requesto.status){Status =requesto.status }
                            if(requesto.replacementStaffName){leavesOutputItem.replacementStaffName = requesto.replacementStaffName}
                            if(requesto.rejectionReason){leavesOutputItem.rejectionReason =requesto.rejectionReason }
                            if(requesto.relaventDocuments){leavesOutputItem.relaventDocuments =requesto.relaventDocuments }
                            if(requesto.DesiredDayoff){leavesOutputItem.DesiredDayoff =requesto.DesiredDayoff }
                            if(requesto.startOfLeave){leavesOutputItem.startOfLeave =requesto.startOfLeave }
                            if(requesto.endOfLeave){leavesOutputItem.endOfLeave =requesto.endOfLeave }
                            if(requesto.replacementSlot){leavesOutputItem.replacementSlot =requesto.replacementSlot }
                            leavesOutput.push(leavesOutputItem)
                        }
                        else{
                            //res.status(400).send("Request's reciever or sender are unidentified")
                        }
                    }
                }
                else{
                   // res.status(400).send("Request with that ID not found")
                }
            }
            //res.status(200).json(leavesOutput)

        }
        else{
            //res.status(401).send("Unauthorized. User is not head of his department")
        }
    } catch (err) {
        console.error(err.message);
        //res.status(500).send("Server Error");
    }
});
//=========================================================================//

// @status  Done & Tested
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

// @status  Done & Tested
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


///CHANGED DURING FRONTEND DEV
// @status  Done & Tested
// @route   POST api/hod/course-cov
// @input   course-Id
// @desc    View the coverage of each course in his/her department
// @access  Private
router.post("/course-cov", [
    check("courseName", "Course name needed.")
  ]
  ,  async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let course = await courseModel.findOne({"courseName" : req.body.courseName});
            if(course){
                if(course.unassignedSlots!=null){ 
                    if(course.teachingSlots.length!=0){
                        let CourseCov = ((course.teachingSlots.length-course.unassignedSlots)/  course.teachingSlots.length)
                        
                        res.status(200).json("Course " +course.courseName+" has coverage "+ CourseCov*100 +"%, and "+course.unassignedSlots+" unassigned slots")
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

// @status  Done & Tested
// @route   POST api/hod/teaching-assignments
// @input   courseId  
// @desc    View teaching assignments (which staff members teach which slots) 
//          of course offered by his department.
// @access  Private
router.post("/teaching-assignments",[
    check("courseName", "Course name needed")
  ]
  ,  async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let course = await courseModel.findOne({"courseName" : req.body.courseName});
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
                                printableTemp.staffTeachingSlotSubType = staffMem.subType,
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

router.get("/courses", async (req, res) => {
    try {
        //Get the Logged in User's department
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
        //check if user is head of the department

        if (depart.HOD_id.toString() == currentUser._id.toString()){
            let coursesOutput = [];
            for(let i=0;i<depart.courses.length;i++){
                crs = await courseModel.findOne({"_id": ObjectId(depart.courses[i])})
                coursesOutput.push({courseName: crs.courseName})
            }
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


router.get('/sidebarData',async(req,res)=>{        
    try {
        //Get the Logged in User & his department 
        let userCode = req.user.id;
        let currentUser = await staffModel.findOne({"id": userCode});
        
        if(currentUser.type == 'HR'){
            res.send('HR')
        }
        else{
            if(currentUser.subType==="instructor"){
                let depart = await departmentModel.findOne({"departmentName" : currentUser.departmentName});
                if (depart.HOD_id.toString() == currentUser._id.toString()){
                    res.send("hod")
                }
                else{
                    res.send('instructor')
                }
            }
            else if(currentUser.subType==="ta"){
                let course = await courseModel.findOne({"coordinator": ObjectId(currentUser._id)});
                if (course){
                    res.send("coordinator")
                }
                else{
                    res.send('ta');
                }
            }
            else{
                res.status(400).send('what are you?!')
            }
        }
        
        
        
        //check if user is head of the department
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error : Server Error.");
    }
   
})


module.exports = router;