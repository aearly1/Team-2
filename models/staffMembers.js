const mongoose = require('mongoose')
const schema = mongoose.Schema
const staffSchema = new schema ({
    imgLink: String,
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
    attendance: Array, //should contain an array of JSON objects that look like this : [{"op": "sign in","time": "2020-12-20T14:08:31.848Z"},{"op": "sign out","time": "2020-12-20T14:09:30.180Z","net": -503.8235833333333}]
    courses: [String], //array with course ids of courses they teach && empty list in case of HR
    scheduleSlots: [mongoose.Types.ObjectId], //can be an array of slot models (nested models) //null in case of HR
    sentRequests: [mongoose.Types.ObjectId], //stores request models sent by this particular staff member
    receivedRequests: [mongoose.Types.ObjectId], //stores request models submitted to this particular staff
    annualLeaves: Number,
    accidentalLeavesLeft: Number,
    Salary: Number,
    firstLogin: Boolean,
    notifications:Array
})

module.exports = mongoose.model('Staff',staffSchema)