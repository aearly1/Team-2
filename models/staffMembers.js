const mongoose = require('mongoose')
const schema = mongoose.Schema
const staffSchema = new schema ({
    email: {type:String,unique:true},
    password: String,
    id: {type:String,unique:true}, 
    name: String,
    gender:String,
    type: String, // can either be HR or academic
    subType: String, // can either be instructor or ta
    office: String,
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
    Salary: Number,
    firstLogin: Boolean
})

module.exports = mongoose.model('Staff',staffSchema)