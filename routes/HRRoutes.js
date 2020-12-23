const express= require('express');
const router= express.Router()
const locationModel = require('../models/location.js')
const slotModel = require('../models/slot.js')
const facultyModel = require('../models/faculty.js')
//const departmentModel = require('../models/Department.js')
const courseModel = require('../models/course.js')
const staffModel = require('../models/staffMembers.js')
const bcrypt = require("bcryptjs");
const { ObjectId } = require('mongodb');
const { check, validationResult } = require("express-validator");
const missinghrs = require('../functions/funcs').missinghours
const missingdays = require('../functions/funcs').missingdays
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, accessTokenSecret, (err, user,type) => {
//             if (err) {
//                 res.sendStatus(403);
//             }
//             if(type != 'HR')
//                 res.sendStatus(403).send('Incorrect user Type');
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

//add location
router.post('/addLocation',[
    check("roomNr", "RoomNr Name incorrect").isString(),
    check("roomType", "Room Type must be lecture hall, tutorial room, lab or office").isString(),
    check("capacity","Capacity must be an integer").isNumeric()
  ]
  ,async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const roomNr = req.body.roomNr
    const roomType = req.body.roomType
    const capacity = req.body.capacity
    const loc = new locationModel({roomNr:roomNr,
        roomType:roomType,
        capacity:capacity
    });
   await loc.save((err) => {
      if (err) 
            res.status(500).send(err);
      else 
          res.send("Added location successfully");
    });
   
});

//edit location
router.post('/editLocation',[
    check("roomNr", "RoomNr Name incorrect").isString(),
    check("roomType", "Room Type must be lecture hall, tutorial room, lab or office").optional().isString(),
    check("capacity","Capacity must be an integer").optional().isNumeric()
  ],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    let location = {}
    location.roomNr= req.body.roomNr
    location.office = req.body.office
    location.capacity = req.body.capacity
    const locat = await locationModel.find({roomNr:location.roomNr})
    if(locat){
    await staffModel.find({office:location.roomNr},(err,loca)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            if(loca!=null){
                res.status(400).send("Cannot edit a location that has registered staff members in it")
            }
        }
    })

    await slotModel.find({slotLocation:locat._id},(err,loca)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            if(loca!=null){
                res.status(400).send("Cannot edit a location that has an assigned slot in it")
            }
        }
    })
    
  await  locationModel.findOneAndUpdate({roomNr:location.roomNr}, {$set:location}, (err, docs)=> { 
    if (err){ 
        res.status(500).send(err) 
    } 
    else{ 
        res.send("Updated location : "+ docs); 
    } 
});
}
});

//delete location
router.post('/deleteLocation',[
    check("roomNr", "RoomNr Name incorrect").isString(),
  ],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const roomNr= req.body.roomNr
    const locat = await locationModel.find({roomNr:roomNr})
    if(locat){
    await staffModel.find({office:roomNr},(err,loca)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            if(loca!=null){
                res.status(400).send("Cannot delete a location that has registered staff members in it")
            }
        }
    })

    await slotModel.find({slotLocation:locat._id},(err,loca)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            if(loca!=null){
                res.status(400).send("Cannot delete a location that has an assigned slot in it")
            }
        }
    })
    
  await  locationModel.findOneAndDelete({roomNr:location.roomNr},  (err, docs)=> { 
    if (err){ 
        res.status(500).send(err) 
    } 
    else{ 
        res.send("Deleted location : "+ docs); 
    } 
});
}
});



//add faculty
router.post('/addFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const facultyName = req.body.facultyName
    const departments = req.body.departments

    const fac = new facultyModel({facultyName:facultyName,departments:departments});
    await fac.save((err) => {
      if (err) 
            res.status(500).send(err);
    res.send("Successfully added faculty: "+ facultyName)
        });

});

//edit faculty
router.post('/editFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    let fac = {}
    fac.facultyName = req.body.facultyName
    fac.departments = req.body.departments
    fac.departments.forEach(async departmentId=>{
        await departmentModel.findOne({_id:departmentId},(err,department)=>{
            if(err)
            res.status(500).send(error)
            else
            if(department == null){
                res.status(400).send("Incorrect department id")
            }
        })
    })
    if(fac.facultyName!= null ){
         await  facultyModel.findOneAndUpdate({facultyName:facultyName},{$set:fac}, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated faculty : " + docs); 
    } 
});
}
else{
        res.sendStatus(400).send("Missing Arguments");
}
});

//delete faculty
router.post('/deleteFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const facultyName = req.body.facultyName

    const staff = await staffModel.findOne({facultyName:facultyName})
    if(staff != null){
        res.status(400).send('Cannot delete a faculty that has assigned academic members')
    }
    await facultyModel.findOneAndDelete({facultyName:facultyName},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed faculty : "+ docs); 
    } 
});
});



//add department
/*router.post('/addDepartment',[
    check("departmentName", "departmentName must be a string").isString(),
    check("HOD_id","Head of department id must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
    const HOD = await staffModel.findOne({id:HOD_Id})
    if(HOD == null ){
        res.status(400).send("The ID does not match any of the staff members")
    }
    const dep = new departmentModel({departmentName:departmentName,
        HOD_id:HOD._id, courses:courses });
   await dep.save((err) => {
      if (err) 
            res.sendStatus(500).send(err);
      else
            res.send("Successfully added department")
        });
});
*/

router.post('/addDepartment',[
    check("departmentName", "Department name must be a string").isString(),
    check("facultyName","Faculty name id must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const departmentName = req.body.departmentName
    const facultyName = req.body.facultyName

    let department = await departmentModel.findOne({departmentName:departmentName})
    let faculty = await courseModel.findOne({facultyName:facultyName})
    if(department ==null)
    res.status(400).send("Incorrect department name")
   if(faculty ==null)
    res.status(400).send("Incorrect faculty name")
    faculty.departments.push(department._id)
    await facultyModel.findOneAndUpdate({facultyName:faculty.facultyName},{departments:faculty.departments},(err,docs) => {
      if (err) 
            res.status(500).send(err);
        else
        res.send("Successfully added department to faculty")
    });


});


//edit department


/*router.post('/editDepartment',[
    check("departmentName", "departmentName must be a string").isString(),
    check("HOD_id","Head of department id must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
    courses.forEach(courseId=>{
    await courseModel.findOne({_id:courseId},(err,course=>{
        if(course == null)
        res.status(400).send("Incorrect course Ids does not exist")
    }))
        })
    const HOD = await staffModel.findOne({id:HOD_Id})
    if(HOD == null ){
        res.status(400).send("The ID does not match any of the staff members")
    }
    let dep = {}
    dep.departmentName = departmentName
    dep.HOD_id = HOD._id
    dep.courses = courses

        await  departmentModel.findOneAndUpdate({departmentName:departmentName}, {$set:dep}, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated department : " + docs); 
    } 
});
});

//delete department
router.post('/deleteDepartment', [
    check("departmentName", "departmentName must be a string").isString()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }


    const departmentName = req.body.departmentName
    const staff = staffModel.findOne({departmentName:departmentName})
    if(staff)
        res.status(400).send("Unable to delete the deparment because staff members are assigned to it")
    await departmentModel.findOneAndDelete({departmentName:departmentName},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed department : "+ docs); 
    } 
});
});
*/
//edit department
router.post('/editDepartment',[
    check("departmentName", "department name must be a string").isString(),
    check("newFacultyName","faculty name must be a string").isString(),
    check("oldFacultyName","faculty name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const departmentName = req.body.departmentName
    const oldFacultyName = req.body.oldFacultyName
    const newFacultyName = req.body.newFacultyName
    let oldFaculty = await facultyModel.findOne({facultyName:oldFacultyName})
    let newFaculty = await facultyModel.findOne({facultyName:newFacultyName})
    let department = await departmentModel.findOne({departmentName:departmentName})
    if(newFaculty ==null)
    res.status(400).send("Incorrect Faculty name")
    if(oldFaculty ==null)
    res.status(400).send("Incorrect Faculty name")
   if(department ==null)
    res.status(400).send("Incorrect department name")
    newFaculty.departments.push(department._id)
    oldFaculty.departments.filter(departmentId=>{
       return departmentId != department._id
    })
    
    await facultyModel.findOneAndUpdate({facultyName:oldFaculty.facultyName},{departments:oldFaculty.departments},(err,docs) => {
      if (err) 
            res.status(500).send(err);
    });

    await facultyModel.findOneAndUpdate({facultyName:newFaculty.facultyName},{departments:newFaculty.departments},(err,docs) => {
      if (err) 
            res.status(500).send(err);
        else
        res.send("Successfully added department to faculty")
    });
});

//delete department


router.post('/deleteDepartment',[
    check("departmentName", "department name must be a string").isString(),
    check("oldFacultyName","faculty name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const departmentName = req.body.departmentName
    const oldFacultyName = req.body.oldFacultyName
    let oldFaculty = await facultyModel.findOne({facultyName:oldFacultyName})
    let department = await departmentModel.findOne({departmentName:departmentName})
    if(oldFaculty ==null)
    res.status(400).send("Incorrect Faculty name")
   if(department ==null)
    res.status(400).send("Incorrect department name")
    oldFaculty.departments.filter(departmentId=>{
       return departmentId != department._id
    })
    
    await facultyModel.findOneAndUpdate({facultyName:oldFaculty.facultyName},{departments:oldFaculty.departments},(err,docs) => {
      if (err) 
            res.status(500).send(err);
        else
        res.send("Successfully removed department from faculty")

        });

});



//add course
/*
router.post('/addCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("de","Coordinator id must be an object of length 24").optional().isLength(24),
    check("unassignedSlots","Unassigned slots must be a number").optional().isNumeric()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    
    const courseName = req.body.courseName
    const instructors = req.body.instructors
    instructors.forEach(instructorId=>{
      await  staffModel.findOne({_id:instructorId},(err,instructor)=>{
          if(err)
          res,status(500).send(err)
          else
          if(instructor==null)
          res.status(400).send("Incorrect instructor id")
          
      })
    })
    
    const TAs = req.body.TAs
    TAs.forEach(TAId=>{
        await  staffModel.findOne({_id:TAId},(err,TA)=>{
            if(err)
            res,status(500).send(err)
            else
            if(TA==null)
            res.status(400).send("Incorrect teaching assitant id")
            
        })
      })
    const coordinator = req.body.coordinator
    const coord =  await staffModel.findOne({_id:coordinator})
    if(coord == null){
        res.status(400).send("Incorrect coordinator id")
    }
    const teachingSlots = req.body.teachingSlots
    teachingSlots.forEach(slotId=>{
        await  slotModel.findOne({_id:slotId},(err,slot)=>{
            if(err)
            res,status(500).send(err)
            else
            if(slot==null)
            res.status(400).send("Incorrect slot id")
            
        })
      })
    const unassignedSlots = req.body.unassignedSlots
    const course = new courseModel({courseName:courseName,
    instructors:instructors, teachingAssistants:TAs,coordinator:coordinator,teachingSlots:teachingSlots,unassignedSlots:unassignedSlots });
   await course.save((err) => {
      if (err) 
            res.sendStatus(500).send(err);
    });
});
*/
router.post('/addCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("departmentName","department name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const courseName = req.body.courseName
    const departmentName = req.body.departmentName
    let department = await departmentModel.findOne({departmentName:departmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(department ==null)
    res.status(400).send("Incorrect department name")
   if(course ==null)
    res.status(400).send("Incorrect course name")
    department.courses.push(course._id)
    await departmentModel.findOneAndUpdate({departmentName:department.departmentName},{courses:department.courses},(err,docs) => {
      if (err) 
            res.status(500).send(err);
        else
        res.send("Successfully added course to department")
    });
});


//edit Course
router.post('/editCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("newDepartmentName","department name must be a string").isString(),
    check("oldDepartmentName","department name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const courseName = req.body.courseName
    const oldDepartmentName = req.body.oldDepartmentName
    const newDepartmentName = req.body.newDepartmentName
    let oldDepartment = await departmentModel.findOne({departmentName:oldDepartmentName})
    let newDepartment = await departmentModel.findOne({departmentName:newDepartmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(newDepartment ==null)
    res.status(400).send("Incorrect department name")
    if(oldDepartment ==null)
    res.status(400).send("Incorrect department name")
   if(course ==null)
    res.status(400).send("Incorrect course name")
    newDepartment.courses.push(course._id)
    oldDepartment.courses.filter(courseId=>{
       return courseId != course._id
    })
    
    await departmentModel.findOneAndUpdate({departmentName:oldDepartment.departmentName},{courses:oldDepartment.courses},(err,docs) => {
      if (err) 
            res.status(500).send(err);
    });

    await departmentModel.findOneAndUpdate({departmentName:newDepartment.departmentName},{courses:newDepartment.courses},(err,docs) => {
      if (err) 
            res.status(500).send(err);
        else
        res.send("Successfully added course to department")
    });
});
//delete course
router.post('/deleteCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("oldDepartmentName","department name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    const courseName = req.body.courseName
    const oldDepartmentName = req.body.oldDepartmentName
    let oldDepartment = await departmentModel.findOne({departmentName:oldDepartmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(oldDepartment ==null)
    res.status(400).send("Incorrect department name")
   if(course ==null)
    res.status(400).send("Incorrect course name")
    oldDepartment.courses.filter(courseId=>{
       return courseId != course._id
    })
    
    await departmentModel.findOneAndUpdate({departmentName:oldDepartment.departmentName},{courses:oldDepartment.courses},(err,docs) => {
      if (err) 
            res.status(500).send(err);
    })
});
/*HR can add a new staff member to the system. For all staff members, HR should add id,
name, email, salary and office location.
– Any extra personal information details is acceptable.
– Emails should be unique.
– Staff member ids are unique. The first academic staff member should have id “ac-1”,
and the first hr member should have id “hr-1”. The system should automatically
increment ids when adding a new staff member.
– Once a staff member is added to the system, his/her password should be set to
a default value: “123456”. The system must prompt new users to change their
passwords on their first login to the system.
– HR can’t assign an office location that already has full capacity.
– HR does not assign a course to a new academic staff member.
email: {type:String,unique:true},
    password: String,
    id: {type:String,unique:true},
    name: String,
    type: String, // can either be HR or academic
    office: Number,
    dayOff: String,
    facultyName: String, //null for HR
    departmentName: String, //null for HR or just set to HR
    attendance: Array, //should contain JS objects that look like this : {day:01,month:09, year:2020, [ {signed in: 7:00, signed out: 9:00},{ signed in: 11:00, signed out: 13:00}]}
    courses: [String], //array with course ids of courses they teach && empty list in case of HR
    scheduleSlots: [mongoose.Types.ObjectId], //can be an array of slot models (nested models) //null in case of HR
    sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
    receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
    annualLeaves: Number,
    accidentalLeavesLeft: Number,
    Salary: Number
– All HR members have Saturday as their day off, and they can’t change it.
           email:email,id:id,
           name:name,type:type, office:office,dayOff:dayOff,
           departmentName:departmentName,
           annualLeaves:annualLeaves,
           accidentalLeavesLeft:accidentalLeavesLeft,
           Salary:Salary,
           facultyName:facultyName, password:password*/


//add staffMember
router.post('/addStaffMember',[
    check("email", "Staff member email must be an email").isEmail(),
    check("name", "Staff member name must be a string").isString(),
    check("type", "Staff member type must be a string").isString(),
    check("office", "Staff member office must be a string").isString(),
    check("dayOff", "Staff member day off must be a string").optional().isString(),
    check("annualLeaves", "Staff member annual leaves must be a number").optional().isNumeric(),
    check("accidentalLeavesLeft", "Staff member accidental leaves left must be a number").optional().isNumeric(),
    check("Salary", "Staff member Salary must be a number").isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const email = req.body.email
    const name = req.body.name
    const type = req.body.type
    const office = req.body.office
    const dayOff = req.body.dayOff
    const facultyName = req.body.facultyName
    const departmentName = req.body.departmentName
    //const attendance = req.body.atendance
    //const scheduleSlots = req.body.scheduleSlots
    // sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
    // receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
    const annualLeaves = req.body.annualLeaves
    const accidentalLeavesLeft = req.body.accidentalLeavesLeft
    const Salary = req.body.Salary
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("123456", salt);
    req.body.password = password

    locationModel.findOne({roomNr:office},async (error,results)=>{
    if(error){
        res.status(500).send("Cannot find office") 
    } 
    else{ 
        if(results.type != 'office')
        res.status(400).send("The office must have type office")
        staffModel.findOne({roomNr:office},async(error1,results1)=>{     
            if(error1)
            res.sendStatus(500)
            else{
               let len = 0
            if(results1 != null)
               len = results1.length
                
    if(results.capacity > len){
    if(type =='HR')
    {
        const HRMax =await staffModel.findOne({type:"HR"}).sort({id:-1})
        let id = 'hr-1'
        if(HRMax!= null){
            const idNum = parseInt(HRMax.id.split('-')[1])+1
            id ='hr-'+idNum;
        }
        req.body.id = id
        if(dayOff!="Saturday"){            
            res.status(422).send("HR must have Saturday as day off")
        }
        else{
        const staff = new staffModel({email:email,id:id,
            name:name,type:type, office:office,dayOff:dayOff,
            departmentName:departmentName,
            annualLeaves:annualLeaves,
            accidentalLeavesLeft:accidentalLeavesLeft,
            Salary:Salary,
            facultyName:facultyName, password:password,firstLogin:true});
   await staff.save((err) => {
      if (err) 
            res.status(500).send(err);
   res.send("Successfully added staff Member")
        });
    }}
    else if (type == 'academic'){
        const acMax =await staffModel.findOne({type:"academic"}).sort({id:-1})
        let id = 'ac-1'
        if(acMax!= null){
        const idNum = parseInt(acMax.id.split('-')[1])+1
        id ='ac-'+idNum;
        }


        const staff = new staffModel({email:email,id:id,
            name:name,type:type, office:office,dayOff:dayOff,
            departmentName:departmentName,
            annualLeaves:annualLeaves,
            accidentalLeavesLeft:accidentalLeavesLeft,
            Salary:Salary,
            facultyName:facultyName, password:password,firstLogin:true});
       await staff.save((err) => {
          if (err) 
                res.status(500).send(err);
          res.send("Successfully added staff Member")

            });
        }
    }
    else{   
        res.sendStatus(422);
    }    
}
    });
    }
});

});
//edit staff member

router.post('/editStaffMember',[
    check("id", "Staff member id must be a string").isString,
    check("email", "Staff member email must be an email").optional().isEmail(),
    check("name", "Staff member name must be a string").optional().isString(),
    check("type", "Staff member type must be a string").optional().isString(),
    check("office", "Staff member office must be a string").optional().isString(),
    check("dayOff", "Staff member day off must be a string").optional().isString(),
    check("annualLeaves", "Staff member annual leaves must be a number").optional().isNumeric(),
    check("accidentalLeavesLeft", "Staff member accidental leaves left must be a number").optional().isNumeric(),
    check("Salary", "Staff member Salary must be a number").optional().isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const id = req.body.id
    const type = req.body.type
    const office = req.body.office
    const dayOff = req.body.dayOff
    //const attendance = req.body.atendance
    //const scheduleSlots = req.body.scheduleSlots
    // sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
    // receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
if(id != null&&office !=null){
   locationModel.findOne({roomNr:office},async (error,results)=>{
    if(error){
        res.status(500).send(error) 
    } 
    else{ 
        staffModel.findOne({roomNr:office},(error1,results1)=>{     
            if(error1)
            res.status(500).send(error1) 
            else{
                if(results.type != 'office')
                res.status(400).send("The office must have type office")
        
        if(results.capacity < results1.length){
        staffModel.findOne({id:id},async (err,staffMember)=>{
                if(err)
                res.status(500).send(err) 
        else{
            if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
            {
                if(dayOff!="Saturday"){            
                    res.status(422)
                }
                else{
         await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
              if (err2) 
                    res.status(500).send(err2);
              else
                    res.send("Updated staff: "+ docs2)  ;
                });
            }}
            else { //not HR
                await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
                    if (err) 
                          res.status(500).send(err1);
                    else
                          res.send("Updated staff: "+ docs1)  ;
                      });
                  }
        }
            });
      
    }
    else{   
        res.sendStatus(422);
    }    
}
    });
    }
});
}
    if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
    {
        if(dayOff!="Saturday"){            
            res.sendStatus(422)
        }
        else{
 await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
      if (err) 
            res.sendStatus(500).send(err2);
      else
            res.send("Updated staff: "+ docs2)  ;
        });
    }}
    else { //not HR
        await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
            if (err) 
                  res.sendStatus(500).send(err1);
            else
                  res.send("Updated staff: "+ docs1)  ;
              });
          }

});


//delete staff member
router.post('/deleteStaffMember',[
     check("id", "Staff member id must be a String").isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

 
    const id = req.body.id
   await staffModel.findOneAndDelete({id:id},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed Staff Member : "+ docs); 
    } 
});
});

//add a missing sign in or sign out
router.post('/addAttendanceRecord',[
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const email = req.email;
    const id = req.body.id;
    const attendanceRecord = req.body.attendanceRecord;
    const timeSpent = attendanceRecord[1].time.getTime()-attendanceRecord[0].time.getTime()/(60*1000);
    attendanceRecord[1].push({key:'net',value:timeSpent})

      await  staffModel.findOne({id:id},(err,staffMember)=>{
            if(err)
            res.sendStatus(500)
            else{
                if(staffMember!=null){
                    res.status(400).send("Incorrect id")
                }
                let matchingRecords = staffMember.attendance.filter(elem=>{
                return elem.time.getFullYear()==attendanceRecord[0].time.getFullYear()&& elem.time.getMonth()==attendanceRecord[0].time.getMonth() && elem.time.getDate()==attendanceRecord[0].time.getDate() && elem.op=="sign out"
                })
            if(staffMember.email != email){
                   if(matchingRecords.length==0){
                       attendanceRecord[0].getDay();
                        let dayOff
                       switch (staffMember.dayOff) {
                        case "Saturday":
                            dayoff=6
                            break;
                        case "Sunday":
                            dayoff=0
                        case "Monday":
                            dayoff=1
                            break;
                        case "Tuesday":
                            dayoff=2
                            break;
                        case "Wednesday":
                            dayoff=3
                            break;
                        case "Thursday":
                            dayoff=4
                            break;
                        case "Friday":
                            dayoff=5
                            break;
                    }
                    if(dayOff != attendanceRecord[0].time.getDay() )
                        attendanceRecord[1].net -= 504
                    }

                    staffMember.attendance.push(attendanceRecord[0])
                    staffMember.attendance.push(attendanceRecord[1])
                    staffModel.findOneAndUpdate({id:staffMember.id},{attendance:staffMember.attendance},(errror,attend)=>{
                if(errror)
                res.status(500).send(errror)
                else
                res.send("Successfully updated the missing attendance")

                    })                        
            }
                
            }


        })

});

//view members attendance record
router.post('viewAttendance',[
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }
    
const id = req.body.id
staffModel.findOne({id:id},(err,staffMember)=>{
if(err)
res.sendStatus(500)
else{
    res.send(staffMember.attendance);
}
})
})



//view members missing hours/days
router.post('/viewMissingDaysOrHours', async (req, res) => {
await staffModel.find((err,result)=>{
if(err)
res.sendStatus(500)
else{
const users = result.filter(u =>{
        let missingDays = missingdays(u)
        let missingHours = missinghrs(u)
        let hours = missingHours.Hours
        let mins = missingHours.Mins
        return missingDays.length>0||Math.sign(mins)==-1 || Math.sign(hours)==-1
})
users.map(user => user.id+" "+user.name)
res.send(users);

}});

})

//update salary
router.post('/updateSalary', [
    check("id", "Staff member id must be a string").isString()  ,
    check("salary", "Staff member salary must be a number").isNumeric()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const id = req.body.id
    const salary = req.body.salary
   await staffModel.findOneAndUpdate({id:id},{Salary:salary},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Update salary of Staff Member : "+ docs); 
    } 
});
});



router.post('/viewSalary', [
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Error with arguments types");
    }

    const id = req.body.id
    await staffModel.findOne({id:id},(err, u)=> { 
    if (err){ 
        res.status(500).send(err) 
    } 
    else{ 
        if(u==null){
            res.status(400).send("Incorrect user ID")
        }
        let baseSalary = u.salary;
        const missingHours =  missinghrs(u);
        const hours = missingHours.Hours
        const mins = missingHours.Mins
        const missingDays = missingdays(u).length
        const daysDeduction = missingDays* baseSalary/60
        let timeDeduction =0 ;
        if(Math.sign(hours)==-1||Math.sign(mins)==-1)
        if(((hours*60)+mins+179)<0)
            timeDeduction = Math.abs(hours*60+mins) *(baseSalary/(180*60))
        const deduction = timeDeduction+daysDeduction
        const salary = baseSalary-deduction
        res.send(salary)   
    } 
});
});

module.exports = router;