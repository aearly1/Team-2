const mongoose = require('mongoose');
const FacultySchema = new mongoose.Schema(
    {
    facultyName: { type: String, required: true,
    default: "New Faculty",},
    departments: [mongoose.Types.ObjectId] //contains department ids
    }
    );
module.exports = mongoose.model("Faculty", FacultySchema);