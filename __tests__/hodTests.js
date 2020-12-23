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
connectDB();

//  beforeAll(async()=>{
//     await StaffModel.deleteMany();
//     await CourseModel.deleteMany();
//     await DepratmentModel.deleteMany();
//     await FacultyModel.deleteMany();
//  })

test('Course add test', async ()=>{
    await CourseModel.deleteMany({})
    let course = new CourseModel({
        courseName: "CSEN 701 - Embedded Systems", });
    await course.save()
    expect(await CourseModel.find({ "courseName": "CSEN 701 - Embedded Systems"})).toHaveLength(1);
})

test('Department add test', async ()=>{
    await DepartmentModel.deleteMany({})
    let hod = await StaffModel.findOne({"name": "Slim"})
    console.log(JSON.stringify(hod))
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
    //let staffMem1 = await StaffModel.findOne({"name":"Hassan Soubra"})
    //let staffMem2 = await StaffModel.findOne({"name":"Milad Ghantous"})
    let location = await LocationModel.findOne({"roomNr":"C6.304"})
    let slot = new SlotModel({
        startTime: Date.now(), //start time of slot
        endTime: Date.now(), // end time of slot
        courseTaughtInSlot: course._id, //what course will be taught in the slot 
        //staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
        slotLocation: ObjectId(location._id), //ex. H14, C7.301
        //replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
    });
    await slot.save()
    expect(await SlotModel.find({ "_id": slot._id})).toHaveLength(1);
})
test('Slot add test #2', async ()=>{
    let course = await CourseModel.findOne({"courseName":"CSEN 701 - Embedded Systems" })
    let staffMem1 = await StaffModel.findOne({"name":"Hassan Soubra"})
    //let staffMem2 = await StaffModel.findOne({"name":"Milad Ghantous"})
    let location = await LocationModel.findOne({"roomNr":"C6.305"})
    let slot = new SlotModel({
        startTime: Date.now(), //start time of slot
        endTime: Date.now(), // end time of slot
        courseTaughtInSlot: course._id, //what course will be taught in the slot 
        staffTeachingSlot: staffMem1._id,// null if this slot is still not assigned to anyone
        slotLocation: ObjectId(location._id), //ex. H14, C7.301
        //replacementStaff: staffMem2._id //if another staff member will replace a staff member on leave
    });
    await slot.save()
    expect(await SlotModel.find({ "_id": slot._id})).toHaveLength(1);
})

test('Course edit test', async () => {
    let location1 = await LocationModel.findOne({"roomNr":"C6.304" })
    let location2 = await LocationModel.findOne({"roomNr":"C6.305" })
   
    let slot1 = await SlotModel.findOne({"slotLocation": ObjectId(location1._id)})
    let slot2 = await SlotModel.findOne({"slotLocation": ObjectId(location2._id)})
    await CourseModel.updateOne({"courseName":"CSEN 701 - Embedded Systems"},{
        "teachingSlots" : [slot1._id, slot2._id],
        "unassignedSlots": 1
    });
    expect(await CourseModel.find({ "courseName": "CSEN 701 - Embedded Systems"})).toHaveLength(1);

})


test('Request add test', async ()=>{
    await RequestModel.deleteMany({})
    let course = await CourseModel.findOne({"courseName": "CSEN 701 - Embedded Systems"})
    let staffMem1 = await StaffModel.findOne({"name":"Hassan Soubra"})
    let staffMem2 = await StaffModel.findOne({"name":"Slim"})
    let replaceSlot = await SlotModel.findOne({"courseTaughtInSlot" : course._id})
    let request = new RequestModel({
        senderID: staffMem1._id, //id of the staff member sending the request
        recieverID: staffMem2._id, //id of the staff member recieving the request
        requestType: "annual leave", //the available request types are change day off OR slot linking OR leave OR replacement)
        status: "pending", //the value of status can either be accepted or rejected or pending
        replacementSlot: replaceSlot._id, //id of slot for replacement request
        requestReason: "My horse is stuck in a fridge",// this field is used by the person sending the request in case this a leave request or a request to change day off
        startOfLeave: Date.now(),
        endOfLeave: Date.now()

    });
    await request.save()
    expect(await RequestModel.find({ "requestType": "annual leave"})).toHaveLength(1);
})

test('Update HOD', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    let request = await RequestModel.findOne({"requestType": "annual leave"})
    await StaffModel.updateOne({"name":"Slim"},{
        "type": "academic",
        "subType": "instructor",
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
    expect(await StaffModel.find({ "name": "Slim"})).toHaveLength(1);
})

test('Make Staff instructor', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"});
    let department = await DepartmentModel.findOne({"departmentName": "MET"});
    let request = await RequestModel.findOne({"requestType": "annual leave"});
    await StaffModel.updateOne({"name":"Hassan Soubra"},{
        "type": "academic",
        "subType": "instructor",
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
    expect(await StaffModel.find({ "name": "Hassan Soubra"})).toHaveLength(1);
})

test('Make Staff instructor #2', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
     await StaffModel.updateOne({"name":"Milad Ghantous"},{
        "type": "academic",
        "subType": "instructor",
        "facultyName": faculty.facultyName,
        "departmentName": department.departmentName, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Wednesday",
        "annualLeaves": 15,
        "accidentalLevesLeft": 2,
        "Salary": 15000,
        "firstLogin": true
    });
    expect(await StaffModel.find({ "name": "Milad Ghantous"})).toHaveLength(1);
})