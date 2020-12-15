const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema(
    {
        roomNr: {type: Number, unique:true, required:true},
        roomType: {type: String, required:true}, //only posible values are lecture halls, tutorial rooms, labs and offices
        capacity: {type: Number, required:true}
    }
);
module.exports= mongoose.model("location", LocationSchema);