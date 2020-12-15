const mongoose = require('mongoose');
const SlotSchema = new mongoose.Schema(
    {
        slotNumber: {type: Number, required:true, unique:true}, //an id for the slot
        startTime: {type: Date, required: true}, //start time of slot
        endTime: {type: Date, required: true}, // end time of slot
        courseTaughtInSlot: {type: String, required: true}, //what course will be taught in the slot 
        staffTeachingSlot: String,// null if this slot is still not assigned to anyone
        slotLocation: {type: String, required: true}, //ex. H14, C7.301
        replacementStaff: String //if another staff member will replace a staff member on leave
    }
);
module.exports= mongoose.model("slot",SlotSchema);