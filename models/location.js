const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema(
    {
        roomNr: {type: String, unique: 1, required:true},
        roomType: {type: String, required:true}, //only posible values are lecture halls, tutorial rooms, labs and offices
        capacity: {type: Number, required:true}
    }
);
module.exports= mongoose.model("location", LocationSchema);