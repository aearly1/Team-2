const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const course = require('./models/course');
const department = require('./models/department.js');
const faculty = require('./models/faculty.js')
const location = require('./models/location.js')
const request = require('./models/request.js')
const slot = require('./models/slot.js')
const staffMembers = require('./models/staffMembers.js');
const { Server, ObjectId } = require('mongodb');

router.route('/academic-coordinator')
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


router.get('/hod-init', async (req,res)=>{
    try { 
        await course.deleteMany({});
        await location.deleteMany({});
        await slot.deleteMany({});
        await department.deleteMany({});
        await staffMembers.deleteMany({});
        await request.deleteMany({})
        await faculty.deleteMany({});
    
        const salt = await bcrypt.genSalt(12)

        // Make a user Slim that is a HOD
        // we will assign him to department,faculty after we make them
        let hashedPassword =await bcrypt.hash("SlimSlim",salt)
        let slim = new staffMembers({ 
            id: "ac-1",
            name: "Slim",
            email: "Slim@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "Saturday",
            "annualLeaves": 20,
            "accidentalLevesLeft": 4,
            "Salary": 50000,
            "firstLogin" : false
        })
        await slim.save();

        //Make a user Hassan Soubra
        hashedPassword =await bcrypt.hash("SoubraSoubra",salt)
        let soubra = new staffMembers({
            id: "ac-2",
            name: "Hassan Soubra",
            email: "HSoubra@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "Saturday",
            "annualLeaves": 16,
            "accidentalLevesLeft": 1,
            "Salary": 18000,
            "firstLogin": false
        })
        await soubra.save();

        hashedPassword =await bcrypt.hash("MiladMilad",salt)
        let milad = new staffMembers({
            id: "ac-3",
            name: "Milad Ghantous",
            email: "MGhantous@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [],
            "dayOff": "Wednesday",
            "annualLeaves": 15,
            "accidentalLevesLeft": 2,
            "Salary": 15000,
            "firstLogin": false
        })
        await milad.save();
        
        //MAKE A COURSE 
        let course1 = new course({
            courseName: "CSEN 701 - Embedded Systems", });
        await course1.save();
        
        //MAKE A DEPARTMENT
        let hod = await staffMembers.findOne({"name": "Slim"})
        let course2 = await course.findOne({"courseName": "CSEN 701 - Embedded Systems"})
        let department1 = new department({
            departmentName: "MET",
            HOD_id: ObjectId(hod._id), //Slim
            courses: [course2._id] //CSEN 701
        });
        await department1.save();

        //MAKE A FACULTY
        let department2 = await department.findOne({"departmentName": "MET"})
        let faculty1 = new faculty({
            facultyName: "Engineering",
            departments: [ department2._id] //MET department
        });
        await faculty1.save()

        //ADD LOCATION 1
        let location1 = new location({
            roomNr: "C6.304",
            roomType: "lab", //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 23
            });
        await location1.save()
    
        
        //ADD LOCATION 2
        let location2 = new location({
            roomNr: "C6.305",
            roomType: "tutorial", //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 24
        });
        await location2.save();
        
        //ADD SLOT 1
        //let staffMem1 = await staffMembers.findOne({"name":"Hassan Soubra"})
        //let staffMem2 = await staffMembers.findOne({"name":"Milad Ghantous"})
        let location3 = await location.findOne({"roomNr":"C6.304"})
        let slot1 = new slot({
            startTime: Date.now(), //start time of slot
            endTime: Date.now(), // end time of slot
            courseTaughtInSlot: course2._id, //what course will be taught in the slot 
            //staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
            slotLocation: ObjectId(location3._id), //ex. H14, C7.301
            //replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
        });
        await slot1.save()
        
        //ADD SLOT 2
        let staffMem1 = await staffMembers.findOne({"name":"Hassan Soubra"})
        //let staffMem2 = await staffMembers.findOne({"name":"Milad Ghantous"})
        let location4 = await location.findOne({"roomNr":"C6.305"})
        let slot2 = new slot({
            startTime: Date.now(), //start time of slot
            endTime: Date.now(), // end time of slot
            courseTaughtInSlot: course2._id, //what course will be taught in the slot 
            staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
            slotLocation: ObjectId(location4._id), //ex. H14, C7.301
            //replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
        });
        await slot2.save();

        //EDIT SOME STUFF IN COURSE CSEN 701
        let slot3 = await slot.findOne({"slotLocation": ObjectId(location3._id)})
        let slot4 = await slot.findOne({"slotLocation": ObjectId(location4._id)})
        await course.updateOne({"courseName":"CSEN 701 - Embedded Systems"},{
            "teachingSlots" : [slot3._id, slot4._id],
            "unassignedSlots": 1
        });

        //ADD REQUEST
        let course5 = await course.findOne({"courseName": "CSEN 701 - Embedded Systems"})
        let staffMem2 = await staffMembers.findOne({"name":"Hassan Soubra"})
        let staffMem3 = await staffMembers.findOne({"name":"Slim"})
        let replaceSlot = await slot.findOne({"courseTaughtInSlot" : course5._id})
        let request1 = new request({
            senderID: staffMem2._id, //id of the staff member sending the request
            recieverID: staffMem3._id, //id of the staff member recieving the request
            requestType: "annual leave", //the available request types are change day off OR slot linking OR leave OR replacement)
            status: "pending", //the value of status can either be accepted or rejected or pending
            replacementSlot: replaceSlot._id, //id of slot for replacement request
            requestReason: "My horse is stuck in a fridge",// this field is used by the person sending the request in case this a leave request or a request to change day off
            startOfLeave: Date.now(),
            endOfLeave: Date.now()
        });
        await request1.save()

        //UPDATE HOD
        let faculty11 = await faculty.findOne({"facultyName": "Engineering"})
        let department11 = await department.findOne({"departmentName": "MET"})
        let request11 = await request.findOne({"requestType": "annual leave"})
        await staffMembers.updateOne({"name":"Slim"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName, 
            "receivedRequests" : [request11._id] 
        });

        //UPDATE Soubra
        await staffMembers.updateOne({"name":"Hassan Soubra"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            "sentRequests" : [request11._id]
        });

        //UPDATE MILAD
        await staffMembers.updateOne({"name":"Milad Ghantous"},{
            "dayOff": "Thursday" , 
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName
        });

        res.status(200).send("DB seeded successfully!")
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})
module.exports=router;