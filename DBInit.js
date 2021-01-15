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

router.route('/')
//DB initialization
.post(async(req,res)=>{
    await course.deleteMany({});
    await location.deleteMany({});
    await slot.deleteMany({});
    await department.deleteMany({});
    await staffMembers.deleteMany({});
    await request.deleteMany({})
    await faculty.deleteMany({});
const salt = await bcrypt.genSalt(12);
var pass = await bcrypt.hash('12345', salt);
const instructor=new staffMembers ({
    email: 'soubra@guc.com',
    password: pass,
    id: 'ac-10271', // Generated using uuidv4
    name: 'Hassan Soubra',
    gender:'Male',
    type: 'academic', // can either be HR or academic
    subType:'instructor',
    office: 'C7-219',
    dayOff: 'Sataurday',
    facultyName: 'MET', //null for HR
    departmentName: 'DMET', //null for HR or just set to HR
    attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
    courses: [], //array with course ids of courses they teach && empty list in case of HR
    scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
    sentRequests: [], //stores request models sent by this particular staff member
    receivedRequests: [], //stores request models submitted to this particular staff
    notifications: [],
    annualLeaves: 400,
    accidentalLeavesLeft: 2,
    Salary: 1000000,
    firstLogin: false,
    imgLink: "https://www.iwsm-mensura.org/wp-content/uploads/2018/08/SOUBRA-PIC-240x300.jpg"
})
await instructor.save();

var TA=new staffMembers ({
    email: 'loaa@guc.com',
    password: pass,
    id: 'ac-10273', // Generated using uuidv4
    name: 'Loaa',
    gender:'Female',
    type: 'academic', // can either be HR or academic
    subType:'ta',
    office: 'C3-203',
    dayOff: 'Tuesday',
    facultyName: 'MET', //null for HR
    departmentName: 'DMET', //null for HR or just set to HR
    attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
    courses: [], //array with course ids of courses they teach && empty list in case of HR
    scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
    sentRequests: [], //stores request models sent by this particular staff member
    receivedRequests: [], //stores request models submitted to this particular staff
    notifications: [],
    annualLeaves: 12,
    accidentalLeavesLeft: 1,
    Salary: 12345,
    firstLogin: false
})
TA.save();

const TA2=new staffMembers ({
    email: 'walid@guc.com',
    password: pass,
    id: 'ac-10272', // Generated using uuidv4
    name: 'Walid',
    gender:'Male',
    type: 'academic', // can either be HR or academic
    subType:'ta',
    office: 'C3-203',
    dayOff: 'Tuesday',
    facultyName: 'MET', //null for HR
    departmentName: 'DMET', //null for HR or just set to HR
    attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
    courses: [], //array with course ids of courses they teach && empty list in case of HR
    scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
    sentRequests: [], //stores request models sent by this particular staff member
    receivedRequests: [], //stores request models submitted to this particular staff
    notifications: [],
    annualLeaves: 12,
    accidentalLeavesLeft: 1,
    Salary: 12345,
    firstLogin: false
})
TA2.save();

var newCourse = new course(
    {
        courseName: 'CSEN605: DSD',
        instructors: [], //array stores ids of instructors teaching this course
        teachingAssistants: [], //array stores ids of teaching assitants of this course
        coordinator: null, // id of the Coordinator of this course
        teachingSlots: [], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
        unassignedSlots: 1, //used to calculate the course coverage
    }
)
await newCourse.save();
await staffMembers.findOneAndUpdate({_id :
    instructor._id},  { $push: {  courses: newCourse._id}}, {new: true});
await staffMembers.findOneAndUpdate({_id :
    TA._id},  { $push: {  courses: newCourse._id}}, {new: true});
await staffMembers.findOneAndUpdate({_id :
    TA2._id},  { $push: {  courses: newCourse._id}}, {new: true});
await course.findOneAndUpdate({_id :
    newCourse._id},  { $push: {  instructors: instructor._id}}, {new: true});
await course.findOneAndUpdate({_id :
    newCourse._id},  { $push: {  teachingAssistants: TA._id}}, {new: true});
await course.findOneAndUpdate({_id :
    newCourse._id},  { $push: {  teachingAssistants: TA2._id}}, {new: true});

var loc = new location(
    {
        roomNr: 'H20',
        roomType: 'lecture hall', //only posible values are lecture halls, tutorial rooms, labs and offices
        capacity: 300
    }
);
await loc.save();
var slot1=new slot(
    {
        day:4,
        slotNr:2,
        startTime: new Date("2020-12-20T12:10:00"), //start time of slot
        endTime: new Date("2020-12-20T12:11:30"), // end time of slot
        courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
        slotLocation: loc._id, //ex. H14, C7.301
    }
);
slot1.save();
await staffMembers.findOneAndUpdate({_id :
    instructor._id},  { $push: {  scheduleSlots: slot1.id}}, {new: true});
await course.findOneAndUpdate({_id :
    newCourse._id},  { $push: {  teachingSlots: slot1._id}}, {new: true});
var slot2=new slot(
    {
        day:5,
        slotNr:1,
        startTime: new Date("2020-12-20T12:08:00"), //start time of slot
        endTime: new Date("2020-12-20T12:09:30"), // end time of slot
        courseTaughtInSlot: newCourse._id, //what course will be taught in the slot ,
        staffTeachingSlot:instructor._id,
        slotLocation: loc._id, //ex. H14, C7.301
    }
);
slot2.save();
await course.findOneAndUpdate({_id :
    newCourse._id},  { $push: {  teachingSlots: slot2._id}}, {new: true});

 //Ali's initiallization data
     pass = await bcrypt.hash('12345', salt);
    const HOD=new staffMembers ({
        email: 'slim@guc.com',
        password: pass,
        id: 'ac-6833', // Generated using uuidv4
        name: 'Slim',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        subType:'instructor',
        office: 'C7-219',
        dayOff: 'Sataurday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
        annualLeaves: 400,
        accidentalLeavesLeft: 2,
        Salary: 1000000,
        firstLogin: false
    })
    HOD.save();

    TA=new staffMembers ({
        email: 'shaka@guc.com',
        password: pass,
        id: 'ac-6834', // Generated using uuidv4
        name: 'Shaka',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        subType:'ta',
        office: 'C3-203',
        dayOff: 'Tuesday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
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
        subType: 'ta',
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
        notifications: [],
        annualLeaves: 50,
        accidentalLeavesLeft: 50,
        Salary: 1,
        firstLogin: false
    })
    Coordinator.save();

    newCourse = new course(
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
    loc = new location(
        {
            roomNr: 'H14',
            roomType: 'lecture hall', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc.save();
    const loc1 = new location(
        {
            roomNr: 'C3. 201',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc1.save();
    const loc2 = new location(
        {
            roomNr: 'C3. 103',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc2.save();
    const loc3 = new location(
        {
            roomNr: 'C6. 204',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc3.save();
    const loc4 = new location(
        {
            roomNr: 'C5. 112',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc4.save();
   const newSlot= new slot(
    {
        day:4,
        slotNr:1,
        startTime: new Date("2020-12-20T12:08:15"), //start time of slot
        endTime: new Date("2020-12-20T12:09:45"), // end time of slot
        courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
        slotLocation: loc._id, //ex. H14, C7.301
    }
    )
   newSlot.save();
    const mySlot= new slot(
        {
            day:5,
            slotNr:1,
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
                    day:5,
                    slotNr:2,
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

 //sa7aba my cloud
 let hashedPassword =await bcrypt.hash("passwordsha2y",salt) 
 await department.findOneAndUpdate({_id :
     dep._id},  { $push: { courses: newCourse._id }}, {new: true});
     const mem = new staffMembers({
        email: "sexysoso@hotmail.com",
        password: hashedPassword,
        id: "43-8530",
        name: "7amada sha3r",
        type: "academic", // can either be HR or academic
        subType: "ta",
        office: "C4.404",
        dayOff: "SAT",
        facultyName: "Tegara", //null for HR
        departmentName: "Fawanees", //null for HR or just set to HR
        attendance: [],
        courses: ["ABC123","XYZ567"], //array with course ids of courses they teach && empty list in case of HR
        annualLeaves: 5,
        Salary: 10
    })
    await mem.save();

     // Make a user Slim that is a HOD
        // we will assign him to department,faculty after we make them
        hashedPassword =await bcrypt.hash("SlimSlim",salt)
        let slim = new staffMembers({ 
            id: "ac-1",
            name: "Slim",
            email: "Slim@gmail.com",
            imgLink: "https://met.guc.edu.eg/Repository/Faculty/Photos/Thumbnail/1_Slim_Abdennadher_thumbnail_Slim.jpg.ashx",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SAT",
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
            imgLink: "data:image/jpeg;base64,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",
            name: "Hassan Sabry",
            email: "HSoubra@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SAT",
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
            "dayOff": "TUE",
            "annualLeaves": 15,
            "accidentalLevesLeft": 2,
            "Salary": 15000,
            "firstLogin": false
        })
        await milad.save();
        
        hashedPassword =await bcrypt.hash("AhmedAhmed",salt)
        let ahmed = new staffMembers({
            id: "ac-4",
            name: "Ahmed Hesham",
            email: "AHesham@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "ta",
            "courses": [],
            "dayOff": "MON",
            "annualLeaves": 13,
            "accidentalLevesLeft": 1,
            "Salary": 8000,
            "firstLogin": false
        })
        await ahmed.save();
        

        //MAKE A COURSE 
        ahmed1 = await staffMembers.findOne({"name": "Ahmed Hesham"})
        var course1 = new course({
            courseName: "CSEN 701 - Embedded Systems",
            teachingAssistants : [ObjectId(ahmed1._id)]  ,
            coordinator : ObjectId(ahmed1._id)
        }
        );
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
         slot1 = new slot({
            startTime: Date.now(), //start time of slot
            endTime: Date.now(), // end time of slot
            courseTaughtInSlot: course2._id, //what course will be taught in the slot 
            //staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
            slotLocation: ObjectId(location3._id), //ex. H14, C7.301
            //replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
        });
        await slot1.save()
        
        //ADD SLOT 2
        let staffMem1 = await staffMembers.findOne({"name":"Hassan Sabry"})
        //let staffMem2 = await staffMembers.findOne({"name":"Milad Ghantous"})
        let location4 = await location.findOne({"roomNr":"C6.305"})
        slot2 = new slot({
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
        let staffMem2 = await staffMembers.findOne({"name":"Hassan Sabry"})
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
        department11 = await department.findOne({"departmentName": "MET"})
        let request11 = await request.findOne({"requestType": "annual leave"})
        await staffMembers.updateOne({"name":"Slim"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName, 
            "receivedRequests" : [request11._id] 
        });

        //UPDATE Soubra
        await staffMembers.updateOne({"name":"Hassan Sabry"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            "sentRequests" : [request11._id]
        });

        //UPDATE MILAD
        await staffMembers.updateOne({"name":"Milad Ghantous"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName
        });
        
        await staffMembers.updateOne({"name":"Ahmed Hesham"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            courses: [course5.courseName]
        });

        // Make an academic user 
        hashedPassword =await bcrypt.hash("12345",salt)
        let ac1 = new staffMembers({ 
            id: "ac-1123",
            name: "Academic Member",
            email: "AC1@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SUN",
            "annualLeaves": 20,
            "accidentalLevesLeft": 4,
            "Salary": 50000,
            "firstLogin" : false
        })
        await ac1.save();

        // Make an academic user 
        let hashedPassword2 =await bcrypt.hash("12345",salt)
        let ac2 = new staffMembers({ 
            id: "ac-22",
            name: "Academic Member2",
            email: "AC2@gmail.com",
            password: hashedPassword2,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SUN",
            "annualLeaves": 20,
            "accidentalLevesLeft": 4,
            "Salary": 50000,
            "firstLogin" : false
        })
        await ac2.save();

        //Make an hr user
        hashedPassword =await bcrypt.hash("12345",salt)
        let hr1 = new staffMembers({
            id: "hr-1",
            name: "HR 1",
            email: "HR1@guc.edu.eg",
            password: hashedPassword,
            "type": "HR",
            "subType": null,
            "courses": [], 
            "dayOff": "SAT",
            "annualLeaves": 16,
            "accidentalLevesLeft": 1,
            "Salary": 18000,
            "firstLogin": false
        })
        await hr1.save();

        // MAKE A COURSE
        ac1 = await staffMembers.findOne({"id": "ac-1"})
        course1 = new course({
            courseName: "Csen301",
            teachingAssistants : [ObjectId(ac1._id)]  });
        await course1.save();
        
        
        //MAKE A DEPARTMENT
         hod = await staffMembers.findOne({"id": "ac-1"})
         department1 = new department({
            departmentName: "CSEN",
            HOD_id: ObjectId(hod._id), //ac-1
        });
        await department1.save();
       
        //MAKE A DEPARTMENT
        let hod2 = await staffMembers.findOne({"id": "ac-2"})
         
        department2 = new department({
            departmentName: "DMET",
            HOD_id: ObjectId(hod2._id), //ac-2
        });
        await department2.save();

 res.send("Data inserted successfuly");

})

router.route('/courseInstructor')
//DB initialization
.post(async(req,res)=>{
        await course.deleteMany({});
        await location.deleteMany({});
        await slot.deleteMany({});
        await department.deleteMany({});
        await staffMembers.deleteMany({});
        await request.deleteMany({})
        await faculty.deleteMany({});
    const salt = await bcrypt.genSalt(12);
    const pass = await bcrypt.hash('12345', salt);
    const instructor=new staffMembers ({
        email: 'soubra@guc.com',
        password: pass,
        id: 'ac-10271', // Generated using uuidv4
        name: 'Hassan Soubra',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        subType:'instructor',
        office: 'C7-219',
        dayOff: 'Sataurday',
        facultyName: 'MET', //null for HR
        departmentName: 'DMET', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
        annualLeaves: 400,
        accidentalLeavesLeft: 2,
        Salary: 1000000,
        firstLogin: false
    })
    await instructor.save();
    
    const TA=new staffMembers ({
        email: 'loaa@guc.com',
        password: pass,
        id: 'ac-10273', // Generated using uuidv4
        name: 'Loaa',
        gender:'Female',
        type: 'academic', // can either be HR or academic
        subType:'ta',
        office: 'C3-203',
        dayOff: 'Tuesday',
        facultyName: 'MET', //null for HR
        departmentName: 'DMET', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
        annualLeaves: 12,
        accidentalLeavesLeft: 1,
        Salary: 12345,
        firstLogin: false
    })
    TA.save();

    const TA2=new staffMembers ({
        email: 'walid@guc.com',
        password: pass,
        id: 'ac-10272', // Generated using uuidv4
        name: 'Walid',
        gender:'Male',
        type: 'academic', // can either be HR or academic
        subType:'ta',
        office: 'C3-203',
        dayOff: 'Tuesday',
        facultyName: 'MET', //null for HR
        departmentName: 'DMET', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
        annualLeaves: 12,
        accidentalLeavesLeft: 1,
        Salary: 12345,
        firstLogin: false
    })
    TA2.save();

    const newCourse = new course(
        {
            courseName: 'CSEN605: DSD',
            instructors: [], //array stores ids of instructors teaching this course
            teachingAssistants: [], //array stores ids of teaching assitants of this course
            coordinator: null, // id of the Coordinator of this course
            teachingSlots: [], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
            unassignedSlots: 1, //used to calculate the course coverage
        }
    )
    await newCourse.save();
    await staffMembers.findOneAndUpdate({_id :
        instructor._id},  { $push: {  courses: newCourse._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
        TA._id},  { $push: {  courses: newCourse._id}}, {new: true});
    await staffMembers.findOneAndUpdate({_id :
        TA2._id},  { $push: {  courses: newCourse._id}}, {new: true});
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  instructors: instructor._id}}, {new: true});
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingAssistants: TA._id}}, {new: true});
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingAssistants: TA2._id}}, {new: true});

    const loc = new location(
        {
            roomNr: 'H20',
            roomType: 'lecture hall', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    await loc.save();
    const slot1=new slot(
        {
            day:4,
            slotNr:2,
            startTime: new Date("2020-12-20T12:10:00"), //start time of slot
            endTime: new Date("2020-12-20T12:11:30"), // end time of slot
            courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
            slotLocation: loc._id, //ex. H14, C7.301
        }
    );
    slot1.save();
    await staffMembers.findOneAndUpdate({_id :
        instructor._id},  { $push: {  scheduleSlots: slot1.id}}, {new: true});
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingSlots: slot1._id}}, {new: true});
    const slot2=new slot(
        {
            day:5,
            slotNr:1,
            startTime: new Date("2020-12-20T12:08:00"), //start time of slot
            endTime: new Date("2020-12-20T12:09:30"), // end time of slot
            courseTaughtInSlot: newCourse._id, //what course will be taught in the slot ,
            staffTeachingSlot:instructor._id,
            slotLocation: loc._id, //ex. H14, C7.301
        }
    );
    slot2.save();
    await course.findOneAndUpdate({_id :
        newCourse._id},  { $push: {  teachingSlots: slot2._id}}, {new: true});
    res.send("Data inserted successfuly");
    
})

router.route('/academic-coordinator')
//DB initialization
.post(async(req,res)=>{
    await course.deleteMany({});
    await location.deleteMany({});
    await slot.deleteMany({});
    await department.deleteMany({});
    await staffMembers.deleteMany({});
    await request.deleteMany({})
    await faculty.deleteMany({});
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
        subType:'instructor',
        office: 'C7-219',
        dayOff: 'Sataurday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
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
        subType:'ta',
        office: 'C3-203',
        dayOff: 'Tuesday',
        facultyName: 'MET', //null for HR
        departmentName: 'CSEN', //null for HR or just set to HR
        attendance: [], //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: [], //array with course ids of courses they teach && empty list in case of HR
        scheduleSlots: [], //can be an array of slot models (nested models) //null in case of HR
        sentRequests: [], //stores request models sent by this particular staff member
        receivedRequests: [], //stores request models submitted to this particular staff
        notifications: [],
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
        subType: 'ta',
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
        notifications: [],
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
    const loc = new location(
        {
            roomNr: 'H14',
            roomType: 'lecture hall', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc.save();
    const loc1 = new location(
        {
            roomNr: 'C3. 201',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc1.save();
    const loc2 = new location(
        {
            roomNr: 'C3. 103',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc2.save();
    const loc3 = new location(
        {
            roomNr: 'C6. 204',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc3.save();
    const loc4 = new location(
        {
            roomNr: 'C5. 112',
            roomType: 'tutorial room', //only posible values are lecture halls, tutorial rooms, labs and offices
            capacity: 300
        }
    );
    loc4.save();
   const newSlot= new slot(
    {
        day:4,
        slotNr:1,
        startTime: new Date("2020-12-20T12:08:15"), //start time of slot
        endTime: new Date("2020-12-20T12:09:45"), // end time of slot
        courseTaughtInSlot: newCourse._id, //what course will be taught in the slot 
        slotLocation: loc._id, //ex. H14, C7.301
    }
    )
   newSlot.save();
    const mySlot= new slot(
        {
            day:5,
            slotNr:1,
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
                    day:5,
                    slotNr:2,
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
        await course.deleteMany({});
        await location.deleteMany({});
        await slot.deleteMany({});
        await department.deleteMany({});
        await staffMembers.deleteMany({});
        await request.deleteMany({})
        await faculty.deleteMany({});
    const salt = await bcrypt.genSalt(12)
    const hashedPassword =await bcrypt.hash("passwordsha2y",salt) 
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: hashedPassword,
            id: "43-8530",
            name: "7amada sha3r",
            type: "academic", // can either be HR or academic
            subType: "ta",
            office: "C4.404",
            dayOff: "SAT",
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
            imgLink: "https://met.guc.edu.eg/Repository/Faculty/Photos/Thumbnail/1_Slim_Abdennadher_thumbnail_Slim.jpg.ashx",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SAT",
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
            imgLink: "data:image/jpeg;base64,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",
            name: "Hassan Sabry",
            email: "HSoubra@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SAT",
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
            "dayOff": "TUE",
            "annualLeaves": 15,
            "accidentalLevesLeft": 2,
            "Salary": 15000,
            "firstLogin": false
        })
        await milad.save();
        
        hashedPassword =await bcrypt.hash("AhmedAhmed",salt)
        let ahmed = new staffMembers({
            id: "ac-4",
            name: "Ahmed Hesham",
            email: "AHesham@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "ta",
            "courses": [],
            "dayOff": "MON",
            "annualLeaves": 13,
            "accidentalLevesLeft": 1,
            "Salary": 8000,
            "firstLogin": false
        })
        await ahmed.save();
        

        //MAKE A COURSE 
        ahmed1 = await staffMembers.findOne({"name": "Ahmed Hesham"})
        let course1 = new course({
            courseName: "CSEN 701 - Embedded Systems",
            teachingAssistants : [ObjectId(ahmed1._id)]  ,
            coordinator : ObjectId(ahmed1._id)
        }
        );
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
        let staffMem1 = await staffMembers.findOne({"name":"Hassan Sabry"})
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
        let staffMem2 = await staffMembers.findOne({"name":"Hassan Sabry"})
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
        await staffMembers.updateOne({"name":"Hassan Sabry"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            "sentRequests" : [request11._id]
        });

        //UPDATE MILAD
        await staffMembers.updateOne({"name":"Milad Ghantous"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName
        });
        
        await staffMembers.updateOne({"name":"Ahmed Hesham"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            courses: [course5.courseName]
        });

        res.status(200).send("DB seeded successfully!")
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

router.get('/hr-init', async (req,res)=>{
    try { 
        await course.deleteMany({});
        await location.deleteMany({});
        await slot.deleteMany({});
        await department.deleteMany({});
        await staffMembers.deleteMany({});
        await request.deleteMany({})
        await faculty.deleteMany({});
    
        const salt = await bcrypt.genSalt(12)

        // Make an academic user 
        let hashedPassword =await bcrypt.hash("12345",salt)
        let ac1 = new staffMembers({ 
            id: "ac-1",
            name: "Academic Member",
            email: "AC1@gmail.com",
            password: hashedPassword,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SUN",
            "annualLeaves": 20,
            "accidentalLevesLeft": 4,
            "Salary": 50000,
            "firstLogin" : false
        })
        await ac1.save();

        // Make an academic user 
        let hashedPassword2 =await bcrypt.hash("12345",salt)
        let ac2 = new staffMembers({ 
            id: "ac-2",
            name: "Academic Member2",
            email: "AC2@gmail.com",
            password: hashedPassword2,
            "type": "academic",
            "subType": "instructor",
            "courses": [], 
            "dayOff": "SUN",
            "annualLeaves": 20,
            "accidentalLevesLeft": 4,
            "Salary": 50000,
            "firstLogin" : false
        })
        await ac2.save();

        //Make an hr user
        hashedPassword =await bcrypt.hash("12345",salt)
        let hr1 = new staffMembers({
            id: "hr-1",
            name: "HR 1",
            email: "HR1@guc.edu.eg",
            password: hashedPassword,
            "type": "HR",
            "subType": null,
            "courses": [], 
            "dayOff": "SAT",
            "annualLeaves": 16,
            "accidentalLevesLeft": 1,
            "Salary": 18000,
            "firstLogin": false
        })
        await hr1.save();

        // MAKE A COURSE
        ac1 = await staffMembers.findOne({"id": "ac-1"})
        let course1 = new course({
            courseName: "Csen301",
            teachingAssistants : [ObjectId(ac1._id)]  });
        await course1.save();
        
        
        //MAKE A DEPARTMENT
        let hod = await staffMembers.findOne({"id": "ac-1"})
        let department1 = new department({
            departmentName: "CSEN",
            HOD_id: ObjectId(hod._id), //ac-1
        });
        await department1.save();
       
        //MAKE A DEPARTMENT
        let hod2 = await staffMembers.findOne({"id": "ac-2"})
        let department2 = new department({
            departmentName: "DMET",
            HOD_id: ObjectId(hod2._id), //ac-2
        });
        await department2.save();

        /*
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
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName
        });
        
        await staffMembers.updateOne({"name":"Ahmed Hesham"},{
            "facultyName": faculty11.facultyName,
            "departmentName": department11.departmentName,
            courses: [course5.courseName]
        });
*/
        res.status(200).send("DB seeded successfully!")
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})












module.exports=router;