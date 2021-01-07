const mongoose = require('mongoose');
const SlotSchema = new mongoose.Schema(
    {
        day: Number,
        slotNr: String,
        startTime: {type: Date, required: true}, //start time of slot
        endTime: {type: Date, required: true}, // end time of slot
        courseTaughtInSlot: {type: mongoose.Types.ObjectId, required: true}, //what course will be taught in the slot 
        staffTeachingSlot: mongoose.Types.ObjectId,// null if this slot is still not assigned to anyone
        slotLocation: {type: mongoose.Types.ObjectId, required: true}, //ex. H14, C7.301
        replacementStaff: mongoose.Types.ObjectId //if another staff member will replace a staff member on leave
    }
);
module.exports= mongoose.model("slot",SlotSchema);