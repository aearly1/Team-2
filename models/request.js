const mongoose = require('mongoose');
const RequestModel = new mongoose.Schema(
    {
        requestID: {type: Number, unique:true, required:true}, //unique id for the request
        senderID: {type: Number, required:true}, //id of the staff member sending the request
        recieverID: {type: Number, required:true}, //id of the staff member recieving the request
        requestType: {type: Number, required:true}, //the available request types are change day off OR slot linking OR leave OR replacement)
        status: {type: Number, required:true}, //the value of status can either be accepted or rejected or pending
        requestReason: String,// this field is used by the person sending the request in case this a leave request or a request to change day off
        rejectionReason: String ,//this field is used by the HOD to state why he rejects the request in case the request is for changing day off or it is aleave request
    }
);
module.exports=mongoose.model("request",RequestModel);