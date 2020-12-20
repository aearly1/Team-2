//require('dotenv').config()
const DepartmentModel= require('../models/department');
const CourseModel = require('../models/course');
const StaffModel = require('../models/staffMembers');
const FacultyModel = require('../models/faculty');
const SlotModel = require('../models/slot');
const RequestModel = require('../models/request');
const LocationModel = require('../models/location');
const { v4: uuidv4 } = require('uuid');
const { Server, ObjectId } = require('mongodb');



const connectDB = require("../config/db");
const course = require('../models/course')
connectDB();

//  beforeAll(async()=>{
//     await StaffModel.deleteMany();
//     await CourseModel.deleteMany();
//     await DepratmentModel.deleteMany();
//     await FacultyModel.deleteMany();
//  })
test('Make Staff HOD 1', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    await StaffModel.updateOne({"name":"Head of Department 1"},{
        "type": "hod",
       //"courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Saturday",
        "annualLeaves": 20,
        "accidentalLevesLeft": 4,
        "Salary": 50000
    });
    expect(await StaffModel.find({ "name": "Head of Department 1"})).toHaveLength(1);
})


test('Course add test', async ()=>{
    await CourseModel.deleteMany({})
    let course = new CourseModel({
        courseName: "CSEN 701 - Embedded Systems",
      //  instructors: [1], //array stores ids of instructors teaching this course
       // teachingAssistants: [6,7], //array stores ids of teaching assitants of this course
      //  coordinator: 2, // id of the coordinator of this course
       // teachingSlots: ["1st slot sunday", "2nd slot wednesday"], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
       // unassignedSlots: 0, //used to calculate the course coverage
    });
    await course.save()
    expect(await CourseModel.find({ "courseName": "CSEN 701 - Embedded Systems"})).toHaveLength(1);
})

test('Department add test', async ()=>{
    await DepartmentModel.deleteMany({})
    let hod = await StaffModel.findOne({"type": "hod"})
    await DepartmentModel.deleteMany({})
    let course = await CourseModel.findOne({"courseName": "CSEN 701 - Embedded Systems"})
    let department = new DepartmentModel({
        departmentName: "MET",
        HOD_id: ObjectId(hod._id), //Slim
        courses: [course._id] //CSEN 701
    });
    await department.save()
    expect(await DepartmentModel.find({"departmentName": "MET"})).toHaveLength(1);
})

test('Faculty add test', async ()=>{
    await FacultyModel.deleteMany({})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    let faculty = new FacultyModel({
        facultyName: "Engineering",
        departments: [ department._id] //MET department
    });
    await faculty.save()
    expect(await FacultyModel.find({ "facultyName": "Engineering"})).toHaveLength(1);
})

test('Location add test', async ()=>{
    await LocationModel.deleteMany({})
    let location = new LocationModel({
        roomNr: "C6.304",
        roomType: "lab", //only posible values are lecture halls, tutorial rooms, labs and offices
        capacity: 23
     });
    await location.save()
    expect(await LocationModel.find({ "roomType": "lab"})).toHaveLength(1);
})

test('Location add test #2', async ()=>{
    let location = new LocationModel({
        roomNr: "C6.305",
        roomType: "tutorial", //only posible values are lecture halls, tutorial rooms, labs and offices
        capacity: 23
     });
    await location.save()
    expect(await LocationModel.find({ "roomType": "lab"})).toHaveLength(1);
})



test('Slot add test', async ()=>{
    await SlotModel.deleteMany({})
    let course = await CourseModel.findOne({"courseName":"CSEN 701 - Embedded Systems" })
    let staffMem1 = await StaffModel.findOne({"name":"Instructor 1"})
    let staffMem2 = await StaffModel.findOne({"name":"Instructor 2"})
    let location = await LocationModel.find({"roomNr":"C6.304"})
    let slot = new SlotModel({
        startTime: Date.now(), //start time of slot
        endTime: Date.now(), // end time of slot
        courseTaughtInSlot: course._id, //what course will be taught in the slot 
        staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
        slotLocation: ObjectId(location._id), //ex. H14, C7.301
        replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
   
    });
    await slot.save()
    expect(await SlotModel.find({ "_id": slot._id})).toHaveLength(1);
})

test('Request add test', async ()=>{
    await RequestModel.deleteMany({})
    let course = await CourseModel.findOne({"courseName": "CSEN 701 - Embedded Systems"})
    let staffMem1 = await StaffModel.findOne({"name":"Instructor 1"})
    let staffMem2 = await StaffModel.findOne({"name":"Head of Department 1"})
    let replaceSlot = await SlotModel.findOne({"courseTaughtInSlot" : course._id})
    let request = new RequestModel({
        senderID: staffMem1._id, //id of the staff member sending the request
        recieverID: staffMem2._id, //id of the staff member recieving the request
        requestType: "leave", //the available request types are change day off OR slot linking OR leave OR replacement)
        status: "pending", //the value of status can either be accepted or rejected or pending
        replacementSlot: replaceSlot._id, //id of slot for replacement request
        requestReason: "My horse is stuck in a fridge",// this field is used by the person sending the request in case this a leave request or a request to change day off
       
    });
    await request.save()
    expect(await RequestModel.find({ "requestType": "leave"})).toHaveLength(1);
})

test('Update HOD', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    let request = await RequestModel.findOne({"requestType": "leave"})
    await StaffModel.updateOne({"name":"Head of Department 1"},{
        "type": "hod",
        "facultyName": faculty.facultyName,
        "departmentName": department.departmentName, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Saturday",
        "annualLeaves": 20,
        "accidentalLevesLeft": 4,
        "Salary": 50000,
        "firstLogin" : false,
        "receivedRequests" : [request._id] 
    });
    expect(await StaffModel.find({ "name": "Head of Department 1"})).toHaveLength(1);
})

test('Make Staff instructor', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"});
    let department = await DepartmentModel.findOne({"departmentName": "MET"});
    let request = await RequestModel.findOne({"requestType": "leave"});
    await StaffModel.updateOne({"name":"Instructor 1"},{
        "type": "instructor",
        "facultyName": faculty.facultyName,
        "departmentName": department.departmentName,//null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Saturday",
        "annualLeaves": 16,
        "accidentalLevesLeft": 1,
        "Salary": 18000,
        "firstLogin": false,
        "sentRequests" : [request._id]
    });
    expect(await StaffModel.find({ "name": "Instructor 1"})).toHaveLength(1);
})

test('Make Staff instructor #2', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
     await StaffModel.updateOne({"name":"Instructor 2"},{
        "type": "instructor",
        "facultyName": faculty.facultyName,
        "departmentName": department.departmentName, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Wednesday",
        "annualLeaves": 15,
        "accidentalLevesLeft": 2,
        "Salary": 15000,
        "firstLogin": true
    });
    expect(await StaffModel.find({ "name": "Instructor 2"})).toHaveLength(1);
})