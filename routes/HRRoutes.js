const express= require('express');
const router= express.Router()
const locationModel = require('../models/location.js')
const slotModel = require('../models/slot.js')
const facultyModel = require('../models/faculty.js')
const departmentModel = require('../models/department')
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
//                 return res.sendStatus(403);
//             }
//             if(type != 'HR')
//                 return res.sendStatus(403).send('Incorrect user Type');
//             req.user = user;
//             next();
//         });
//     } else {
//         return res.sendStatus(401);
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
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add rooms");
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
    {        return res.status(500).send(err);
    } else 
          return res.send("Added location successfully");
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
        return  res.status(400).send("Error with arguments types");
        
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add rooms");
    }
    let location = {}
    location.roomNr= req.body.roomNr
    location.roomType = req.body.roomType
    location.capacity = req.body.capacity
    const locat = await locationModel.findOne({roomNr:location.roomNr})
    if(locat){
    await staffModel.findOne({office:location.roomNr},(err,loca)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            if(loca!=null){
                return res.status(400).send("Cannot edit a location that has registered staff members in it")
            }
        }
    })

    await slotModel.findOne({slotLocation:locat._id},(err,loca)=>{
        if(err){
            return res.status(500).send(err)
         }
        else{
            if(loca!=null){
                return res.status(400).send("Cannot edit a location that has an assigned slot in it")
                 }
        }
    })
    
  await  locationModel.findOneAndUpdate({roomNr:location.roomNr}, {$set:location}, (err, docs)=> { 
    if (err){ 
        return res.status(500).send(err) 
    } 
    else{ 
        return res.send("Updated location : "+ docs); 
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
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can delete rooms");
    }
    const roomNr= req.body.roomNr
    const locat = await locationModel.findOne({roomNr:roomNr})
    if(locat){
    await staffModel.findOne({office:roomNr},(err,loca)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            if(loca!=null){
                return res.status(400).send("Cannot delete a location that has registered staff members in it")
            }
        }
    })

    await slotModel.findOne({slotLocation:locat._id},(err,loca)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            if(loca!=null){
                return res.status(400).send("Cannot delete a location that has an assigned slot in it")
            }
        }
    })
    
  await  locationModel.findOneAndDelete({roomNr:locat.roomNr},  (err, docs)=> { 
    if (err){ 
        return res.status(500).send(err) 
    } 
    else{ 
        return res.send("Deleted location : "+ docs); 
    
    } 
});
}
else
    return res.status(200).send("Room not found to delete")
});



//add faculty
router.get('/getDepartments',async (req,res)=>{
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add faculties");
    }
    departmentModel.find((err,departments)=>{
        if(err)
        {
            return res.status(500).send(err)
        }
        else{
            let departs = [];
            departs[0] = departments.map(x=> x.departmentName)
            departs[1] =departments.map(x=>x._id)
            return res.send(departs);
        }
    }
        )
})

router.post('/addFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add faculties");
    }


    const facultyName = req.body.facultyName
    const departments = req.body.departments
    if(departments)
    departments.forEach(async departmentId=>{
       await  departmentModel.findOne({_id:departmentId},(err,department)=>{
            if(err)
            {   
                return res.status(500).send(err);
            }
                else
            if(department == null){
                return res.status(400).send("Incorrect department Id")
            }
       })
    })
    const fac = new facultyModel({facultyName:facultyName,departments:departments});
    await fac.save((err) => {
      if (err) {
            return res.status(500).send(err);
        }

    return res.send("Successfully added faculty: "+ facultyName)
        });

});

//edit faculty
router.post('/editFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can update faculties");
    }
    let fac = {}
    fac.facultyName = req.body.facultyName
    fac.departments = req.body.departments
    fac.departments.forEach(async departmentId=>{
        await departmentModel.findOne({_id:departmentId},(err,department)=>{
            if(err){
            return res.status(500).send(error)
        } 
           else
            if(department == null){
                return res.status(400).send("Incorrect department id")
                    }
        })
    })
         await  facultyModel.findOneAndUpdate({facultyName:fac.facultyName},{$set:fac}, (err, docs)=> { 
    if (err){ 
        return res.status(500).send(err) 
    } 
    else{ 
        return res.send("Updated faculty : " + docs); 
    } 
});
});

//delete faculty
router.post('/deleteFaculty',[
    check("facultyName", "facultyName must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can delete faculties");
    }


    const facultyName = req.body.facultyName

    await staffModel.find({facultyName:facultyName},(err,staff)=>{
        if(err)
        {
            return res.status(500).send(err)
        }
        staff.forEach(async s=>{
          await  staffModel.findOneAndUpdate({_id:s._id},{facultyName:null},(error,updatedS)=>{
              if(error)
          {    return res.status(500).send(error)
        }  
        })
        })
    })
        await facultyModel.findOneAndDelete({facultyName:facultyName},(err, docs)=> { 
    if (err){ 
        return res.sendStatus(500).send(err) 
    } 
    else{ 
        return res.send("Removed faculty : "+ docs); 
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
        return res.status(400).send("Error with arguments types");
    }

    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
    const HOD = await staffModel.findOne({id:HOD_Id})
    if(HOD == null ){
        return res.status(400).send("The ID does not match any of the staff members")
    }
    const dep = new departmentModel({departmentName:departmentName,
        HOD_id:HOD._id, courses:courses });
   await dep.save((err) => {
      if (err) 
            return res.sendStatus(500).send(err);
      else
            return res.send("Successfully added department")
        });
});
*/

router.post('/addDepartment',[
    check("departmentName", "Department name must be a string").isString(),
    check("facultyName","Faculty name id must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add departments");
    }
    const departmentName = req.body.departmentName
    const facultyName = req.body.facultyName

    let department = await departmentModel.findOne({departmentName:departmentName})
    let faculty = await facultyModel.findOne({facultyName:facultyName})
    if(department ==null)
    {return res.status(400).send("Incorrect department name")
}
if(faculty ==null)
    {return res.status(400).send("Incorrect faculty name")
}
    facultyModel.find((err,fac)=>{
        if(err)
        {return res.status(500).send(err)
        }
        fac.forEach(async f=>{
            let departs = f.departments
            departs = departs.filter(d=>{return d==department._id})
            if(departs.length>0)
           {return res.status(400).send("the department already is assigned to another faculty")
        }})
        })

        staffModel.find({departmentName:department.departmentname},(err,staff)=>{
            if(err)
            {return res.status(500).send(err)
}
            staff.forEach(async s=>{
              await  staffModel.findOneAndUpdate({_id:s._id},{facultyName:facultyName},(error,updatedS)=>{
                  if(error)
                  {return res.status(500).send(error)
                }
            })
            })
        })
    
    faculty.departments.push(department._id)
    await facultyModel.findOneAndUpdate({facultyName:faculty.facultyName},{departments:faculty.departments},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
            }
                else
        return res.send("Successfully added department to faculty")
    });



});


//edit department


/*router.post('/editDepartment',[
    check("departmentName", "departmentName must be a string").isString(),
    check("HOD_id","Head of department id must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }

    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
    courses.forEach(courseId=>{
    await courseModel.findOne({_id:courseId},(err,course=>{
        if(course == null)
        return res.status(400).send("Incorrect course Ids does not exist")
    }))
        })
    const HOD = await staffModel.findOne({id:HOD_Id})
    if(HOD == null ){
        return res.status(400).send("The ID does not match any of the staff members")
    }
    let dep = {}
    dep.departmentName = departmentName
    dep.HOD_id = HOD._id
    dep.courses = courses

        await  departmentModel.findOneAndUpdate({departmentName:departmentName}, {$set:dep}, (err, docs)=> { 
    if (err){ 
        return res.sendStatus(500).send(err) 
    } 
    else{ 
        return res.send("Updated department : " + docs); 
    } 
});
});

//delete department
router.post('/deleteDepartment', [
    check("departmentName", "departmentName must be a string").isString()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }


    const departmentName = req.body.departmentName
    const staff = staffModel.findOne({departmentName:departmentName})
    if(staff)
        return res.status(400).send("Unable to delete the deparment because staff members are assigned to it")
    await departmentModel.findOneAndDelete({departmentName:departmentName},(err, docs)=> { 
    if (err){ 
        return res.sendStatus(500).send(err) 
    } 
    else{ 
        return res.send("Removed department : "+ docs); 
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
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can update departments");
    }
    const departmentName = req.body.departmentName
    const oldFacultyName = req.body.oldFacultyName
    const newFacultyName = req.body.newFacultyName
    let oldFaculty = await facultyModel.findOne({facultyName:oldFacultyName})
    let newFaculty = await facultyModel.findOne({facultyName:newFacultyName})
    let department = await departmentModel.findOne({departmentName:departmentName})
    if(newFaculty ==null)
    {return res.status(400).send("Incorrect Faculty name")
}
    if(oldFaculty ==null)
    {return res.status(400).send("Incorrect Faculty name")
}
    if(department ==null)
    {return res.status(400).send("Incorrect department name")
}
    newFaculty.departments=newFaculty.departments.filter(departmentId=>{
    return String(departmentId) != String(department._id )
    })

    newFaculty.departments.push(department._id)
    oldFaculty.departments=oldFaculty.departments.filter(departmentId=>{
       return String(departmentId) != String(department._id )
    })
    await facultyModel.findOneAndUpdate({facultyName:oldFaculty.facultyName},{departments:oldFaculty.departments},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
            }
            });

    staffModel.find({departmentName:department.departmentname},(err,staff)=>{
        if(err)
        {return res.status(500).send(err)
        }
        staff.forEach(async s=>{
          await  staffModel.findOneAndUpdate({_id:s._id},{facultyName:newFacultyName},(error,updatedS)=>{
              if(error)
              {return res.status(500).send(error)
}
                  })
        })
    })

    await facultyModel.findOneAndUpdate({facultyName:newFaculty.facultyName},{departments:newFaculty.departments},(err,docs) => {
      if (err){ 
            return res.status(500).send(err);
        }else
        return res.send("Successfully added department to faculty")
    });
});

//delete department


router.post('/deleteDepartment',[
    check("departmentName", "department name must be a string").isString(),
    check("oldFacultyName","faculty name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can delete departments");
}
    const departmentName = req.body.departmentName
    const oldFacultyName = req.body.oldFacultyName
    let oldFaculty = await facultyModel.findOne({facultyName:oldFacultyName})
    let department = await departmentModel.findOne({departmentName:departmentName})
    if(oldFaculty ==null)
    {return res.status(400).send("Incorrect Faculty name")
}
    if(department ==null)
    {return res.status(400).send("Incorrect department name")
}
    oldFaculty.departments= oldFaculty.departments.filter(departmentId=>{
       return String(departmentId) != String(department._id)
    })
    
    await staffModel.findOneAndUpdate({departmentName:departmentName},{departmentName:null},(err,docs) => {
        if (err) 
    {          return res.status(500).send(err);
    }     });

          await facultyModel.findOneAndUpdate({facultyName:oldFaculty.facultyName},{departments:oldFaculty.departments},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
}
        else
        return res.send("Successfully removed department from faculty")

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
        return res.status(400).send("Error with arguments types");
    }
    
    const courseName = req.body.courseName
    const instructors = req.body.instructors
    instructors.forEach(instructorId=>{
      await  staffModel.findOne({_id:instructorId},(err,instructor)=>{
          if(err)
          res,status(500).send(err)
          else
          if(instructor==null)
          return res.status(400).send("Incorrect instructor id")
          
      })
    })
    
    const TAs = req.body.TAs
    TAs.forEach(TAId=>{
        await  staffModel.findOne({_id:TAId},(err,TA)=>{
            if(err)
            res,status(500).send(err)
            else
            if(TA==null)
            return res.status(400).send("Incorrect teaching assitant id")
            
        })
      })
    const coordinator = req.body.coordinator
    const coord =  await staffModel.findOne({_id:coordinator})
    if(coord == null){
        return res.status(400).send("Incorrect coordinator id")
    }
    const teachingSlots = req.body.teachingSlots
    teachingSlots.forEach(slotId=>{
        await  slotModel.findOne({_id:slotId},(err,slot)=>{
            if(err)
            res,status(500).send(err)
            else
            if(slot==null)
            return res.status(400).send("Incorrect slot id")
            
        })
      })
    const unassignedSlots = req.body.unassignedSlots
    const course = new courseModel({courseName:courseName,
    instructors:instructors, teachingAssistants:TAs,coordinator:coordinator,teachingSlots:teachingSlots,unassignedSlots:unassignedSlots });
   await course.save((err) => {
      if (err) 
            return res.sendStatus(500).send(err);
    });
});
*/
router.post('/addCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("departmentName","department name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can add courses to departments");
    }

    const courseName = req.body.courseName
    const departmentName = req.body.departmentName
    let department = await departmentModel.findOne({departmentName:departmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(department ==null)
    {return res.status(400).send("Incorrect department name")
}
    if(course ==null)
    {return res.status(400).send("Incorrect course name")
}
    department.courses.push(course._id)
    await departmentModel.findOneAndUpdate({departmentName:department.departmentName},{courses:department.courses},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
}
      else
        return res.send("Successfully added course to department")
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
        return res.status(400).send("Error with arguments types");
    }

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can update courses under departments");
    }

    const courseName = req.body.courseName
    const oldDepartmentName = req.body.oldDepartmentName
    const newDepartmentName = req.body.newDepartmentName
    let oldDepartment = await departmentModel.findOne({departmentName:oldDepartmentName})
    let newDepartment = await departmentModel.findOne({departmentName:newDepartmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(newDepartment ==null)
    {return res.status(400).send("Incorrect department name")
}
    if(oldDepartment ==null)
    {return res.status(400).send("Incorrect department name")
}
    if(course ==null)
    {return res.status(400).send("Incorrect course name")
}
    newDepartment.courses=newDepartment.courses.filter(courseId=>{
       return String(courseId) != String(course._id)
    })
    newDepartment.courses.push(course._id)
    oldDepartment.courses=oldDepartment.courses.filter(courseId=>{
       return String(courseId) != String(course._id)
    })
    
    await departmentModel.findOneAndUpdate({departmentName:oldDepartment.departmentName},{courses:oldDepartment.courses},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
}});

    await departmentModel.findOneAndUpdate({departmentName:newDepartment.departmentName},{courses:newDepartment.courses},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);
}
                else
        return res.send("Successfully added course to department")
    });
});
//delete course
router.post('/deleteCourse',[
    check("courseName", "courseName must be a string").isString(),
    check("oldDepartmentName","department name must be a string").isString()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can delete courses from departments");
    }

    const courseName = req.body.courseName
    const oldDepartmentName = req.body.oldDepartmentName
    let oldDepartment = await departmentModel.findOne({departmentName:oldDepartmentName})
    let course = await courseModel.findOne({courseName:courseName})
    if(oldDepartment ==null)
    {return res.status(400).send("Incorrect department name")
}
    if(course ==null)
    {return res.status(400).send("Incorrect course name")
}
    oldDepartment.courses=oldDepartment.courses.filter(courseId=>{
        return String(courseId) != String(course._id)
    })
    
    await departmentModel.findOneAndUpdate({departmentName:oldDepartment.departmentName},{courses:oldDepartment.courses},(err,docs) => {
      if (err) 
            {return res.status(500).send(err);    
}
    return res.send("Successfully removed course from the department")

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
    check("subType", "Staff member subType must be a string").optional().isString(),
    check("office", "Staff member office must be a string").isString(),
    check("dayOff", "Staff member day off must be a string").optional().isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
    check("annualLeaves", "Staff member annual leaves must be a number").optional().isNumeric(),
    check("accidentalLeavesLeft", "Staff member accidental leaves left must be a number").optional().isNumeric(),
    check("Salary", "Staff member Salary must be a number").isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const uType = req.user.type;
    if(uType != "HR"){
        return res.status(400).send("Only HR members can create new staff members ");
    }

    const email = req.body.email
    const name = req.body.name
    const type = req.body.type
    const subType = req.body.subType
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
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash("123456", salt);
    req.body.password = password

    if(facultyName)
    await facultyModel.findOne({facultyName:facultyName},async (error,results)=>{
        if(error){
            return res.status(400).send("Cannot find faculty") 
        }
    })
    let depart;
    if(departmentName){
    depart=await departmentModel.findOne({departmentName:departmentName});

    if (depart == null ){
        return res.status(400).send("Cannot find department") 
    }
    }
    await locationModel.findOne({roomNr:office},async (error,results)=>{
    if(error){
        return res.status(500).send("Cannot find office") 
    } 
    else{ 
        if(results.roomType != 'office')
        {return res.status(400).send("The office must have type office")
    }
        else{
      await  staffModel.find({roomNr:office},async(error1,results1)=>{     
            if(error1)
            {return res.sendStatus(500)
                return;}
                else{
               let len = 0
            if(results1 != null)
               len = results1.length
                
    if(results.capacity > len+1){
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
            return res.status(422).send("HR must have Saturday as day off")
        }
        else{
        const staff = new staffModel({email:email,id:id,
            name:name,type:type, office:office,dayOff:dayOff,
            departmentName:departmentName,
            annualLeaves:annualLeaves,
            accidentalLeavesLeft:accidentalLeavesLeft,
            Salary:Salary,
            facultyName:facultyName, password:password,firstLogin:true});
   await staff.save((err3) => {
      if (err3) 
            {return res.status(500).send(err3);
}
                return res.send("Successfully added staff Member")
        });
    }}
    else if (type == 'academic'){
        const acMax =await staffModel.findOne({type:"academic"}).sort({id:-1})
        let id = 'ac-1'
        if(acMax!= null){
        const idNum = parseInt(acMax.id.split('-')[1])+1
        id ='ac-'+idNum;
        }
        let hodFlag = false
        if(subType == "hod"){
            subType = 'instructor'
            hodFlag = true
        }
        const staff = new staffModel({email:email,id:id,
            name:name,type:type, office:office,dayOff:dayOff,
            departmentName:departmentName,
            annualLeaves:annualLeaves,
            accidentalLeavesLeft:accidentalLeavesLeft,
            Salary:Salary,
            subType:subType,
            facultyName:facultyName, password:password,firstLogin:true});
       await staff.save((err) => {
          if (err) 
                {return res.status(500).send(err);
}
                });
            let sta;
            if(hodFlag)
            sta =await  staffModel.findOne({id:id})
            await departmentModel.findOneAndUpdate({departmentName:depart.departmentName},{HOD_id:sta._id},(er,uD)=>{
                if(er)
                {return res.status(500).send(er)
}
                })
                
            return res.send("Successfully added staff Member")

        }
    }
    else{   
        return res.status(422).send("The office selected is at full capacity");
    }    
}
    });
    }}
});

});
//edit staff member

router.post('/editStaffMember',[
    check("id", "Staff member id must be a string").isString(),
    check("email", "Staff member email must be an email").optional().isEmail(),
    check("name", "Staff member name must be a string").optional().isString(),
    check("type", "Staff member type must be a string").optional().isString(),
    check("subType", "Staff member subType must be a string").optional().isString(),
    check("office", "Staff member office must be a string").optional().isString(),
    check("dayOff", "Staff member day off must be a string").optional().isString(),
    check("annualLeaves", "Staff member annual leaves must be a number").optional().isNumeric(),
    check("accidentalLeavesLeft", "Staff member accidental leaves left must be a number").optional().isNumeric(),
    check("Salary", "Staff member Salary must be a number").optional().isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).send("Error with arguments types");
    }
    const uType = req.user.type;
    if(uType != "HR"){
        return res.status(400).send("Only HR members can update staff members ");
    }


    const id = req.body.id
    const type = req.body.type
    const office = req.body.office
    const dayOff = req.body.dayOff
    const facultyName = req.body.facultyName
    const departmentName = req.body.departmentName
    //const attendance = req.body.atendance
    //const scheduleSlots = req.body.scheduleSlots
    // sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
    // receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
    if(facultyName)
    await facultyModel.findOne({facultyName:facultyName},async (error,results)=>{
        if(error){
            return res.status(400).send("Cannot find faculty") 
        }
    })
    if(departmentName)
    await departmentModel.findOne({departmentName:departmentName},async (error,results)=>{
        if(error){
            return res.status(400).send("Cannot find department") 
        }
    })


    if(!office===''){
   locationModel.findOne({roomNr:office},async (error,results)=>{
    if(error){
        return res.status(500).send(error) 
    } 
    else{ 
        staffModel.find({roomNr:office},(error1,results1)=>{     
            if(error1)
            {return res.status(500).send(error1) 
            }else{
                if(results.roomType != 'office')
                {return res.status(400).send("The office must have type office")
}
        if(results.capacity < results1.length){
        staffModel.findOne({id:id},async (err,staffMember)=>{
                if(err)
                {return res.status(500).send(err) 
}
             else{
            if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
            {
                if(req.body.subType)
                    delete req.body.subType
                if(dayOff){
                if(dayOff!="Saturday"){            
                    return res.status(422).send("HR dayoff must be Saturday")
                  }
                else{
                    
            await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
              if (err2) 
                    {return res.status(500).send(err2);
}
             else{
                    return res.send("Updated staff: "+ docs2)  ;
                }});
            }}}
            else { //not HR
                if(req.body.subType == "hod"){
                    req.body.subType = 'instructor'           
                     const sta =await  staffModel.findOne({id:id})
                    if(req.body.departmentName){
                       await departmentModel.findOneAndUpdate({HOD_id:sta._id},{HOD_id:null},(er,uD)=>{
                     if(er)
                     {return res.status(500).send(er)
}
                    })
                        await departmentModel.findOneAndUpdate({departmentName:req.body.departmentName},{HOD_id:sta._id},(er,uD)=>{
                     if(er)
                     {return res.status(500).send(er)
}
                    })
                }
                else
                departmentModel.findOneAndUpdate({departmentName:sta.departmentName},{HOD_id:sta._id},(er,uD)=>{
                    if(er)
                    {return res.status(500).send(er)
}
                    })
                }  
                else if(req.body.subType == "instructor"||req.body.subType == "ta")
                departmentModel.findOneAndUpdate({departmentName:sta.departmentName},{HOD_id:null},(er,uD)=>{
                    if(er)
                    {return res.status(500).send(er)
}
                    })
        
                                
                await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
                    if (err1) 
                          {return res.status(500).send(err1);
}
                            else
                          return res.send("Updated staff: "+ docs1)  ;
                      });
                  }
        }
            });
      
    }
    else{   
        return res.sendStatus(422);
        return;
    }    
}
    });
    }
});
}
   
   else{ 
    const staffMember =  staffModel.findOne({id:id},async (err)=>{
        if(err)
        {return res.status(500).send(err)
}
        })
    if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
    {
        if(req.body.subType)
            delete req.body.subType
        
        if(dayOff!="Saturday"){            
            {return res.status(422).send("HR dayoff must be Saturday")
            }
    }
        else{
     await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
      if (err) 
            {return res.status(500).send(err2);
}
                else
            return res.send("Updated staff: "+ docs2)  ;
        });
    }}
    else { //not HR
        if(req.body.subType == "hod"){
            req.body.subType = 'instructor'           
             const sta =await  staffModel.findOne({id:id})
            if(req.body.departmentName){
               await departmentModel.findOneAndUpdate({HOD_id:sta._id},{HOD_id:null},(er,uD)=>{
             if(er)
             {return res.status(500).send(er)
}
            })
                await departmentModel.findOneAndUpdate({departmentName:req.body.departmentName},{HOD_id:sta._id},(er,uD)=>{
             if(er)
             {return res.status(500).send(er)
                }
            })
        }
        else
        departmentModel.findOneAndUpdate({departmentName:sta.departmentName},{HOD_id:sta._id},(er,uD)=>{
            if(er)
            {return res.status(500).send(er)
}
            })
        }  
        else if(req.body.subType == "instructor"||req.body.subType == "ta")
        departmentModel.findOneAndUpdate({departmentName:sta.departmentName},{HOD_id:null},(er,uD)=>{
            if(er)
            {return res.status(500).send(er)
}
            })

        await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
            if (err1) 
                  {return res.status(500).send(err1);
}
                else
                  return res.send("Updated staff: "+ docs1)  ;
              });
          }
        }
});


//delete staff member
router.post('/deleteStaffMember',[
     check("id", "Staff member id must be a String").isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
}
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can delete staff members ");
}

 
    const id = req.body.id
   await staffModel.findOneAndDelete({id:id},(err, docs)=> { 
    if (err){ 
        return res.status(500).send(err) 
} 
    else{ 
        return res.send("Removed Staff Member : "+ docs); 
    } 
});
});

//add a missing sign in or sign out
router.post('/addAttendanceRecord',[
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can create new staff members ");
    }

    const email = req.email;
    const id = req.body.id;
    const attendanceRecord = req.body.attendanceRecord;
    attendanceRecord[1].time = new Date(attendanceRecord[1].time)
    attendanceRecord[0].time = new Date(attendanceRecord[0].time)
    attendanceRecord[0].time.setHours(attendanceRecord[0].time.getHours()+2)
    attendanceRecord[1].time.setHours(attendanceRecord[1].time.getHours()+2)
    const timeSpent = (attendanceRecord[1].time.getTime()-attendanceRecord[0].time.getTime())/(60*1000);
    attendanceRecord[1].net = timeSpent
      await  staffModel.findOne({id:id},(err,staffMember)=>{
            if(err)
            {return res.sendStatus(500)
                return;}
                else{
                if(staffMember==null){
                    return res.status(400).send("Incorrect id")
                }
                let matchingRecords = staffMember.attendance.filter(elem=>{
                return elem.time.getFullYear()==attendanceRecord[0].time.getFullYear()&& elem.time.getMonth()==attendanceRecord[0].time.getMonth() && elem.time.getDate()==attendanceRecord[0].time.getDate() && elem.op=="sign out"
                })
            if(staffMember.email != email){
                   if(matchingRecords.length==0){
                       attendanceRecord[0].time.getDay();
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
                {return res.status(500).send(errror)
}
                    else
                return res.send("Successfully updated the missing attendance")

                    })                        
            }
                
            }


        })

});

//view members attendance record
router.post('/viewAttendance',[
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can view attendance of other staff members ");
    }

const id = req.body.id
staffModel.findOne({id:id},(err,staffMember)=>{
if(err){
return res.sendStatus(500)
return;
}else{
    if(staffMember)
    return res.send(staffMember.attendance);
    else
    return res.status(400).send("Staff Member does not exist")
}
})
})



//view members missing hours/days
router.post('/viewMissingDaysOrHours', async (req, res) => {

    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can view attendance of other staff members ");
    }


await staffModel.find((err,result)=>{
if(err)
{return res.sendStatus(500)
    return;}
    else{
let users = result.filter(u =>{
        let missingDays = missingdays(u)
        let missingHours = missinghrs(u)
        let hours = missingHours.Hours
        let mins = missingHours.Mins
        return missingDays.length>0||Math.sign(mins)==-1 || Math.sign(hours)==-1
})
users = users.map(user => 'ID: '+ user.id+", Name :"+user.name)
return res.send(users);

}});

})

//update salary
router.post('/updateSalary', [
    check("id", "Staff member id must be a string").isString()  ,
    check("salary", "Staff member salary must be a number").isNumeric()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
    }
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can update the base salary ");
    }

    const id = req.body.id
    const salary = req.body.salary
   await staffModel.findOneAndUpdate({id:id},{Salary:salary},(err, docs)=> { 
    if (err){ 
        return res.sendStatus(500).send(err) 
        return;
    } 
    else{ 
        return res.send("Update salary of Staff Member : "+ docs); 
    } 
});
});



router.post('/viewSalary', [
    check("id", "Staff member id must be a string").isString()  
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("Error with arguments types");
}
    const type = req.user.type;
    if(type != "HR"){
        return res.status(400).send("Only HR members can view the salary of other staff members");
}


    const id = req.body.id
    await staffModel.findOne({id:id},(err, u)=> { 
    if (err){ 
        return res.status(500).send(err) 
    } 
    else{ 
        if(u==null){
            return res.status(400).send("Incorrect user ID")
        }
        let baseSalary = u.Salary;
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
        return res.send(''+salary)   
    } 
});
});

module.exports = router;