const mongoose = require('mongoose');
const RequestModel = new mongoose.Schema(
    {
        senderID: {type: mongoose.Types.ObjectId, required:true}, //id of the staff member sending the request
        recieverID: {type: mongoose.Types.ObjectId, required:true}, //id of the staff member recieving the request
        requestType: {type: String, required:true}, //the available request types are change day off OR slot linking OR annual leave OR accidental leave OR sick leave OR maternity leave OR compensation leave replacement)
        status: {type: String, required:true}, //the value of status can either be accepted or rejected or pending
        replacementSlot: {type: mongoose.Types.ObjectId}, //id of slot for replacement request
        replacementStaffName: String,
        DesiredDayOff: String,// SAT,SUN, MON, TUES, WED ,THURS, FRI
        relaventLeaveDocuments: String,
        requestReason: String,// this field is used by the person sending the request in case this a leave request or a request to change day off
        rejectionReason: String ,//this field is used by the HOD to state why he rejects the request in case the request is for changing day off or it is aleave request
        startOfLeave: Date,
        endOfLeave: Date
    }
);
module.exports=mongoose.model("request",RequestModel);