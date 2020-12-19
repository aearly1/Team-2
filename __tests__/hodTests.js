//require('dotenv').config()
const DepartmentModel= require('../models/department')
const CourseModel = require('../models/course')
const StaffModel = require('../models/staffMembers')
const FacultyModel = require('../models/faculty')
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
    let hod = await StaffModel.findOne({"type": "hod"})
    await DepartmentModel.deleteMany({})
    let course = await CourseModel.findOne({"courseName": "CSEN 701 - Embedded Systems"})
    let department = new DepartmentModel({
        departmentName: "MET",
        HOD_id: hod._id, //Slim
        courses: [course._id] //CSEN 701
    });
    await department.save()
    expect(await DepartmentModel.find({"departmentName": "MET"})).toHaveLength(1);
})

test('Faculty add test', async ()=>{
    await FacultyModel.deleteMany({})
    department = DepartmentModel.find({"departmentName":"MET"})
    let faculty = new FacultyModel({
        facultyName: "Engineering",
        departments: [ department._id] //MET department
    });
    await faculty.save()
    expect(await FacultyModel.find({ "facultyName": "Engineering"})).toHaveLength(1);
})

test('Make Staff HOD', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    await StaffModel.updateOne({"name":"Head of Department 1"},{
        "type": "hod",
        "facultyId": faculty._id,
        "departmentId": department._id, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Saturday",
        "annualLeaves": 20,
        "accidentalLevesLeft": 4,
        "Salary": 50000
    });
    expect(await StaffModel.find({ "name": "Head of Department 1"})).toHaveLength(1);
})

test('Make Staff instructor', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    await StaffModel.updateOne({"name":"Instructor 1"},{
        "type": "instructor",
        "facultyId": faculty._id,
        "departmentId": department._id, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Saturday",
        "annualLeaves": 16,
        "accidentalLevesLeft": 1,
        "Salary": 18000
    });
    expect(await StaffModel.find({ "name": "Instructor 1"})).toHaveLength(1);
})

test('Make Staff instructor #2', async ()=>{
    let faculty = await FacultyModel.findOne({"facultyName": "Engineering"})
    let department = await DepartmentModel.findOne({"departmentName": "MET"})
    await StaffModel.updateOne({"name":"Instructor 2"},{
        "type": "instructor",
        "facultyId": faculty._id,
        "departmentId": department._id, //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        "courses": [], //array with course ids of courses they teach && empty list in case of HR
        "dayOff": "Wednesday",
        "annualLeaves": 15,
        "accidentalLevesLeft": 2,
        "Salary": 15000
    });
    expect(await StaffModel.find({ "name": "Instructor 2"})).toHaveLength(1);
})