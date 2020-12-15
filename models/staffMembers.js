const mongoose = require('mongoose')
const schema = mongoose.Schema
const staffSchema = new schema ({
    email: {type:String,unique:true},
    password: String,
    id: {type:String,unique:true},
    name: String,
    type: String,
    office: Number,
    dayOff: String,
    faculty: String,
    department: String,
    attendance: [],
    courses: [String],
    schedule: [mongoose.Schema.Types.Slot],
    sentRequests: [mongoose.Schema.Types.Request],
    receivedRequests: [mongoose.Schema.Types.Request],
    annualLeaves: Number,
    Salary: Number
})

module.exports = mongoose.model('Staff',staffSchema)