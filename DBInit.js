const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const course = require('./models/course');
const department= require('./models/department.js');
const faculty = require('./models/faculty.js')
const location= require('./models/location.js')
const request = require('./models/request.js')
const slot= require('./models/slot.js')
const staffMembers = require('./models/staffMembers.js');

router.route('/Ali')
//DB initialization
.post(async(req,res)=>{
    //Ali's initiallization data
    const salt = await bcrypt.genSalt(12);
    const pass = await bcrypt.hash('12345', salt);
    const HOD=new staffMembers ({
        email: 'slim@guc.com',
        password: pass,
        id: 'ac-6833', // Generated using uuidv4
        name: 'Slim',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        office: 'C7-219',
        dayOff: 'Sataurday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        annualLeaves: 400,
        accidentalLeavesLeft: 2,
        Salary: 1000000,
        firstLogin: false
    })
    HOD.save();

    const TA=new staffMembers ({
        email: 'shaka@guc.com',
        password: pass,
        id: 'ac-6834', // Generated using uuidv4
        name: 'Shaka',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        office: 'C3-203',
        dayOff: 'Tuesday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        annualLeaves: 12,
        accidentalLeavesLeft: 1,
        Salary: 12345,
        firstLogin: false
    })
    TA.save();

    const Coordinator=new staffMembers ({
        email: 'ali@guc.com',
        password: pass,
        id: 'ac-6835', // Generated using uuidv4
        name: 'Ali',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        office: 'C3-205',
        dayOff: 'Wednesday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        annualLeaves: 50,
        accidentalLeavesLeft: 50,
        Salary: 1,
        firstLogin: false
    })
    Coordinator.save();

    const newCourse = new course(
        {
            courseName: 'CSEN701: Embedded Systems',
            instructors: [], //array stores ids of instructors teaching this course
            teachingAssistants: [], //array stores ids of teaching assitants of this course
            coordinator: Coordinator._id, // id of the Coordinator of this course
            teachingSlots: [], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
            unassignedSlots: 1, //used to calculate the course coverage
        }
    )
    newCourse.save();
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: { instructors: HOD._id}}, {new: true});
    await course.findOneAndUpdate({_id :
            newCourse._id},  { $push: { instructors: TA._id}}, {new: true});
    await course.findOneAndUpdate({_id :
            newCourse._id},  { $push: { teachingAssistants: Coordinator._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
            HOD._id},  { $push: {  courses: newCourse._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
            TA._id},  { $push: {  courses: newCourse._id}}, {new: true});
    const loc = new location(
        {
            roomNr: 'H14',
            roomType: 'lecture hall', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc.save();
   const newSlot= new slot(
    {
        startTime: new Date("2020-12-20T12:08:15"), //start time of slot
        endTime: new Date("2020-12-20T12:09:45"), // end time of slot
        courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
        slotLocation: loc._id, //ex. H14, C7.301
    }
    )
   newSlot.save();
    const mySlot= new slot(
        {
            startTime: new Date("2020-12-20T12:10:00"), //start time of slot
            endTime: new Date("2020-12-20T12:11:30"), // end time of slot
            courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
            staffTeachingSlot: TA._id,// null if this slot is still not assigned to anyone
            slotLocation: loc._id, //ex. H14, C7.301
        }
    )
    mySlot.save();
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingSlots: newSlot}}, {new: true});
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingSlots: mySlot}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
        TA._id},  { $push: {  scheduleSlots: mySlot._id}}, {new: true}); 
    await staffMembers.findOneAndUpdate({_id :
            Coordinator._id},  { $push: {  courses: newCourse._id}}, {new: true}); 
     await staffMembers.findOneAndUpdate({_id :
            TA._id},  { $push: {  courses: newCourse._id}}, {new: true}); 

            const hisSlot= new slot(
                {
                    startTime: new Date("2020-12-20T12:10:00"), //start time of slot
                    endTime: new Date("2020-12-20T12:11:30"), // end time of slot
                    courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
                    staffTeachingSlot: Coordinator._id,// null if this slot is still not assigned to anyone
                    slotLocation: loc._id, //ex. H14, C7.301
                }
            )
            hisSlot.save();
            await course.findOneAndUpdate({_id :
                newCourse._id},  { $push: {  teachingSlots: hisSlot._id}}, {new: true});
            await staffMembers.findOneAndUpdate({_id :
                Coordinator._id},  { $push: {  scheduleSlots: hisSlot._id}}, {new: true})
       
    const slotLinkingReq= new request(
        {
            senderID: TA._id, //id of the staff member sending the request
            recieverID: Coordinator._id, //id of the staff member recieving the request
            requestType: 'slot linking', //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
            status: 'pending', //the value of status can either be accepted or rejected or pending
            replacementSlot: newSlot._id
        }
    )
    slotLinkingReq.save();
    const ReplacementReq= new request(
        {
            senderID: TA._id, //id of the staff member sending the request
            recieverID: Coordinator._id, //id of the staff member recieving the request
            requestType: 'replacement', //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
            status: 'pending', //the value of status can either be accepted or rejected or pending
            replacementSlot: mySlot._id, //id of slot for replacement request
            startOfLeave: new Date('2021-12-20T12:08:15.000+00:00'),
            endOfLeave: new Date('2021-12-20T12:08:15.000+00:00')
        }
    )
    ReplacementReq.save();
    await staffMembers.findOneAndUpdate({_id :
        TA._id},  { $push: {  sentRequests: slotLinkingReq._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
        TA._id},  { $push: {  sentRequests: ReplacementReq._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
            Coordinator._id},  { $push: {  receivedRequests: slotLinkingReq._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
            Coordinator._id},  { $push: {  receivedRequests: ReplacementReq._id}}, {new: true});

            const ReplacementReq2= new request(
                {
                    senderID: Coordinator._id, //id of the staff member sending the request
                    recieverID: TA._id, //id of the staff member recieving the request
                    requestType: 'replacement', //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
                    status: 'pending', //the value of status can either be accepted or rejected or pending
                    replacementSlot: hisSlot._id, //id of slot for replacement request
                    startOfLeave: new Date('2021-12-20T12:08:15.000+00:00'),
                    endOfLeave: new Date('2021-12-20T12:08:15.000+00:00')
                }
            )
            await ReplacementReq2.save();
            await staffMembers.findOneAndUpdate({_id :
                Coordinator._id},  { $push: {  sentRequests: ReplacementReq2._id}}, {new: true});
            await staffMembers.findOneAndUpdate({_id :
                    TA._id},  { $push: {  receivedRequests: ReplacementReq2._id}}, {new: true});
        const changeDayOff= new request(
        {
            senderID: TA._id, //id of the staff member sending the request
            recieverID: HOD._id, //id of the staff member recieving the request
            requestType: 'change day off', //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
            status: 'rejected', //the value of status can either be accepted or rejected or pending
            replacementSlot: hisSlot._id, //id of slot for replacement request
            DesiredDayOff: "SAT",
            requestReason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni."
        }
        )
        changeDayOff.save();
        await staffMembers.findOneAndUpdate({_id :
            TA._id},  { $push: {  sentRequests: changeDayOff._id}}, {new: true});
        await staffMembers.findOneAndUpdate({_id :
            HOD._id},  { $push: {  receivedRequests: changeDayOff._id}}, {new: true});
            const changeDayOff2= new request(
                {
                    senderID: TA._id, //id of the staff member sending the request
                    recieverID: HOD._id, //id of the staff member recieving the request
                    requestType: 'change day off', //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
                    status: 'accepted', //the value of status can either be accepted or rejected or pending
                    replacementSlot: hisSlot._id, //id of slot for replacement request
                    DesiredDayOff: "SAT",
                    requestReason: "I have a partime job in a company and I work on that day."
                }
                )
                await changeDayOff2.save();
                await staffMembers.findOneAndUpdate({_id :
                    TA._id},  { $push: {  sentRequests: changeDayOff2._id}}, {new: true});
                await staffMembers.findOneAndUpdate({_id :
                    HOD._id},  { $push: {  receivedRequests: changeDayOff2._id}}, {new: true});
    const dep = new department(
        {
            departmentName:"CSEN",
            HOD_id: HOD._id,
            courses: [] //array with course ids of courses belonging to this department
        }
    );
    dep.save();
    await department.findOneAndUpdate({_id :
        dep._id},  { $push: { courses: newCourse._id }}, {new: true});
    
    res.send("Data inserted successfuly");
    
})
router.post('/staffMems',async(req,res)=>{
    const salt = await bcrypt.genSalt(12)
    const hashedPassword =await bcrypt.hash("passwordsha2y",salt) 
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: hashedPassword,
            id: "43-8530",
            name: "7amada sha3r",
            type: "Academic", // can either be HR or academic
            office: "C4.404",
            dayOff: "Saturday",
            facultyName: "Tegara", //null for HR
            departmentName: "Fawanees", //null for HR or just set to HR
            attendance: [],
            courses: ["ABC123","XYZ567"], //array with course ids of courses they teach && empty list in case of HR
            annualLeaves: 5,
            Salary: 10
        })
        await mem.save()
    res.status(200).send("Seeded for testing staff routes")
})
module.exports=router;