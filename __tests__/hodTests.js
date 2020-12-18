//require('dotenv').config()
const DepartmentModel= require('../models/department')
const CourseModel = require('../models/course')
const StaffModel = require('../models/staffMembers')
const FacultyModel = require('../models/faculty')

const connectDB = require("../config/db");
connectDB();

// beforeEach(async()=>{
//     await StaffModel.deleteMany();
//     await CourseModel.deleteMany();
//     await DepratmentModel.deleteMany();
// })
test('getUserToken', async ()=>{
    await FacultyModel.deleteMany({})
    let faculty = new FacultyModel({
        facultyName: "Engineering",
      //  departments: [1,2,3] //contains department ids
    });
    await faculty.save()
    expect(await FacultyModel.find({ "facultyName": "Engineering"})).toHaveLength(1);
})


test('staffMember add test', async ()=>{
    await StaffModel.deleteMany({})
    let staff = new StaffModel({
        email: "sshakirafanboy@gmail.com",
        password: "MyHipsNeverLie",
        id: "1", 
        name: "Abdelrahman Diab",
        departmentName: "MET", //null for HR or just set to HR //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
        courses: ["CSEN 501", "CSEN 703"], //array with course ids of courses they teach && empty list in case of HR
        // scheduleSlots: [mongoose.Types.ObjectId], //can be an array of slot models (nested models) //null in case of HR
        // sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
        // receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
        Salary: 50000
    });
    await staff.save()
    expect(await StaffModel.find({ "name": "Abdelrahman Diab"})).toHaveLength(1);
})


test('User Type to HOD',  async ()=>{
    let user = await StaffModel.findOne({"email":"UserTypeChangeTest@gmail.com" })
   
    expect(await FacultyModel.find({ "facultyName": "Engineering"})).toHaveLength(1);
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
    let department = new DepartmentModel({
        departmentName: "MET",
        HOD_id: "41224d776a326fb40f000001",
       // courses: [1,2,3,4] //array with course ids of courses belonging to this department
    });
    await department.save()
    expect(await DepartmentModel.find({  "departmentName": "MET"})).toHaveLength(1);
})

test('Faculty add test', async ()=>{
    await FacultyModel.deleteMany({})
    let faculty = new FacultyModel({
        facultyName: "Engineering",
      //  departments: [1,2,3] //contains department ids
    });
    await faculty.save()
    expect(await FacultyModel.find({ "facultyName": "Engineering"})).toHaveLength(1);
})


// test('Assign instructor to course', async ()=>{
//     await staffModel.deleteMany({})
//     expect(await staffModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('Delete course instructor', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })
    
// test('View staff in department', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('View day off of all staff in department', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('View day off of single staff in department', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('View day off request by staff in his department', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('Accept a request', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('Reject a request', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('View course coverage', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })

// test('View teaching assignments of courses offered by department', async ()=>{
//     await UserModel.deleteMany({})
//     expect(await UserModel.find({ "name": "Saeed"})).toHaveLength(0);
// })