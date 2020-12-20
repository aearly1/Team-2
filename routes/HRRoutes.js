const express= require('express');
const router= express.Router()
const locationModel = require('../models/location.js')
const facultyModel = require('../models/faculty.js')
//const departmentModel = require('../models/Department.js')
const courseModel = require('../models/course.js')
const staffModel = require('../models/staffMembers.js')
const bcrypt = require("bcryptjs");
const { ObjectId } = require('mongodb');
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
//         res.sendStatus(401);
//     }
// };

//add location
router.post('/addLocation',async (req, res) => {
 
    const roomNr = req.body.roomNr
    const roomType = req.body.roomType
    const capacity = req.body.capacity
if(roomNr!= null && roomType != null && capacity != null){
    const loc = new locationModel({roomNr:roomNr,
        roomType:roomType,
        capacity:capacity
    });
   await loc.save((err) => {
      if (err) 
            return res.status.send(err);
    });
    res.send("Added location successfully");
}
else{
        return res.status(400).send("Missing Arguments");
}
});

//edit location
router.post('/editLocation',async (req, res) => {
    const roomNr = req.body.roomNr
    const newRoomType = req.body.roomType
    const newCapacity = req.body.capacity
if(roomNr!= null && newRoomType != null && newCapacity != null){
  await  locationModel.findOneAndUpdate({roomNr:roomNr}, {roomType:newRoomType,
        capacity:newCapacity}, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated location : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//delete location
router.post('/deleteLocation', async (req, res) => {
    const roomNr = req.body.roomNr    
    if(roomNr!= null){
   await locationModel.findOneAndDelete({roomNr:roomNr},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed location : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});



//add faculty
router.post('/addFaculty',async (req, res) => {
    const facultyName = req.body.facultyName
    const departments = req.body.departments
 if(facultyName!= null ){
 const fac = new facultyModel({facultyName:facultyName,departments:departments});
   await fac.save((err) => {
      if (err) 
            return res.status(500).send(err);
    return res.send("Successfully added faculty: "+ facultyName)
        });
}
else{
        return res.status(400).send("Missing Arguments");
}
});

//edit faculty
router.post('/editFaculty',async (req, res) => {
    const facultyName = req.body.facultyName
    const departments = [ObjectId(),ObjectId()]
    if(facultyName!= null ){
         await  facultyModel.findOneAndUpdate({facultyName:facultyName},{departments:departments}, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated faculty : " + docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//delete faculty
router.post('/deleteFaculty', async (req, res) => {
    const facultyName = req.body.facultyName
    
    if(facultyName!= null){
   await facultyModel.findOneAndDelete({facultyName:facultyName},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed faculty : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});



//add department
router.post('/addDepartment',async (req, res) => {
    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
 if(departmentName!= null && HOD_Id!= null ){
    const HOD = await departmentModel.findOne({HOD_id:HOD_Id})
    const coursesIds = courses.map(async (course)=>{
     return await courseModel.findOne({courseName:course})._id
    });
    const dep = new departmentModel({departmentName:departmentName,
        HOD_id:HOD._id, courses:coursesIds });
   await dep.save((err) => {
      if (err) 
            return res.sendStatus(500).send(err);
    });
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//edit department
router.post('/editDepartment',async (req, res) => {
    const departmentName = req.body.departmentName
    const HOD_Id = req.body.HOD_id
    const courses = req.body.courses
    if(departmentName!= null && HOD_Id!= null ){
        const HOD = await departmentModel.findOne({HOD_id:HOD_Id})
        const coursesIds = courses.map(async (course)=>{
         return await courseModel.findOne({courseName:course})._id
        });
              await  departmentModel.findOneAndUpdate({departmentName:departmentName}, {HOD_Id:HOD._id,courses:coursesIds}, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated department : " + docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//delete department
router.post('/deleteDepartment', async (req, res) => {
    const departmentName = req.body.departmentName
    if(departmentName!= null){
   await departmentModel.findOneAndDelete({departmentName:departmentName},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed department : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});




//add course

router.post('/addCourse',async (req, res) => {
    const courseName = req.body.courseName
    const instructors = req.body.instructors
    const TAs = req.body.TAs
    const coordinator = req.body.coordinator
    const teachingSlots = req.body.teachingSlots
    const unassignedSlots = req.body.unassignedSlots
 if(courseName!= null ){
 const course = new courseModel({courseName:courseName,
        instructors:instructors, teachingAssistants:TAs,coordinator:coordinator,teachingSlots:teachingSlots,unassignedSlots:unassignedSlots });
   await course.save((err) => {
      if (err) 
            return res.sendStatus(500).send(err);
    });
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//edit Course
router.post('/editCourse',async (req, res) => {
    const courseName = req.body.courseName
    const instructors = req.body.instructors
    const TAs = req.body.TAs
    const coordinator = req.body.coordinator
    const teachingSlots = req.body.teachingSlots
    const unassignedSlots = req.body.unassignedSlots
    if(courseName!= null){
         await  courseModel.findOneAndUpdate({courseName:courseName}, {instructors:instructors, teachingAssistants:TAs,coordinator:coordinator,teachingSlots:teachingSlots,unassignedSlots:unassignedSlots }, (err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Updated Course : " + docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//delete course
router.post('/deleteCourse', async (req, res) => {
    const courseName = req.body.courseName
    if(courseName!= null){
   await courseModel.findOneAndDelete({courseName:courseName},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed course : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
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
router.post('/addStaffMember',async (req, res) => {
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
if(type!= null&&name != null&& email!=null&& Salary!=null &&office!=null){

    locationModel.findOne({roomNr:office},async (error,results)=>{
    if(error){
        res.status(500).send("Cannot find office") 
    } 
    else{ 
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
            return res.status(500).send(err);
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


        const staff = new staffModel({email:email,id:id,
            name:name,type:type, office:office,dayOff:dayOff,
            departmentName:departmentName,
            annualLeaves:annualLeaves,
            accidentalLeavesLeft:accidentalLeavesLeft,
            Salary:Salary,
            facultyName:facultyName, password:password,firstLogin:true});
       await staff.save((err) => {
          if (err) 
                return res.status(500).send(err);
          return res.send("Successfully added staff Member")

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
}
else{
        return res.status(400).send("Missing Arguments`");
}
});
//edit staff member

router.post('/addStaffMember',async (req, res) => {
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
        res.sendStatus(500).send(error) 
    } 
    else{ 
        staffModel.findOne({roomNr:office},(error1,results1)=>{     
            if(error1)
            res.sendStatus(500).send(error1) 
            else{
        if(results.capacity < results1.length){
        staffModel.findOne({id:id},async (err,staffMember)=>{
                if(err)
                res.sendStatus(500).send(err) 
        else{
            if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
            {
                if(dayOff!="Saturday"){            
                    res.sendStatus(422)
                }
                else{
         await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
              if (err) 
                    return res.sendStatus(500).send(err2);
              else
                    return res.send("Updated staff: "+ docs2)  ;
                });
            }}
            else { //not HR
                await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
                    if (err) 
                          return res.sendStatus(500).send(err1);
                    else
                          return res.send("Updated staff: "+ docs1)  ;
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
else if (id!=null){

    if(type =='HR'||(staffMember.type =='HR'&&type!='academic'))
    {
        if(dayOff!="Saturday"){            
            res.sendStatus(422)
        }
        else{
 await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err2,docs2) => {
      if (err) 
            return res.sendStatus(500).send(err2);
      else
            return res.send("Updated staff: "+ docs2)  ;
        });
    }}
    else { //not HR
        await staffModel.findOneAndUpdate({id:id},{$set:req.body},(err1,docs1) => {
            if (err) 
                  return res.sendStatus(500).send(err1);
            else
                  return res.send("Updated staff: "+ docs1)  ;
              });
          }
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});


//delete staff member
router.post('/deleteStaffMember', async (req, res) => {
    const id = req.body.id
    if(id!= null){
   await staffModel.findOneAndDelete({id:id},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Removed Staff Member : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});

//add a missing sign in or sign out
router.post('/addAttendanceRecord', async(req,res)=>{
    const email = req.email;
    const id = req.body.id;
    const attendanceRecord = req.body.attendanceRecord;
    const timeSpent = attendanceRecord[1].time.getTime()-attendanceRecord[0].time.getTime()/(60*1000);
    attendanceRecord[1].push({key:'net',value:timeSpent})
    if(id!=null){
      await  staffModel.findOne({id:id},(err,staffMember)=>{
            if(err)
            res.sendStatus(500)
            else{
            let matchingRecords = staffMember.attendance.filter(elem=>{
                return elem.time.getFullYear()==attendanceRecord[0].time.getFullYear()&& elem.time.getMonth()==attendanceRecord[0].time.getMonth() && elem.time.getDate()==attendanceRecord[0].time.getDate() && elem.op=="sign out"
                })
            if(staffMember.email != email){
                   if(matchingRecords.length==0){
                        attendanceRecord[1].net -= 504
                    }
                let matchingRecordSignIn = matchingRecords.filter(record =>{
                    return record.time.getTime() < attendanceRecord[0].time.getTime()
                })
                        matchingRecords.splice(matchingRecordSignIn.length,0,attendanceRecord[1])
                        matchingRecords.splice(matchingRecordSignIn.length,0,attendanceRecord[0])
  
            }
                
            }


        })
    }

});

//view members attendance record
router.post('viewAttendance',async(req,res)=>{
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
router.post('/viewMissingDaysOrHours',async(req,res)=>{
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
router.post('/updateSalary', async (req, res) => {
    const id = req.body.id
    const salary = req.body.salary
    if(id!= null&&salary!=null){
   await staffModel.findOneAndUpdate({id:id},{Salary:salary},(err, docs)=> { 
    if (err){ 
        res.sendStatus(500).send(err) 
    } 
    else{ 
        res.send("Update salary of Staff Member : "+ docs); 
    } 
});
}
else{
        return res.sendStatus(400).send("Missing Arguments");
}
});



router.post('/viewSalary', async (req, res) => {
    const id = req.body.id
    if(id!= null){
   await staffModel.findOne({id:id},(err, u)=> { 
    if (err){ 
        res.status(500).send(err) 
    } 
    else{ 
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
}
else{
        return res.status(400).send("Missing Arguments");
}
});

module.exports = router;