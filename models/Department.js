const mongoose = require('mongoose');
const DepartmentSchema = new mongoose.Schema(
    {
        departmentName: {type: String, required:true, default: "New Department"},
        HOD_id: {type: Number, required:true},
        courses: Array //array with course ids of courses belonging to this department
    }
);
module.exports= mongoose.model("Department", DepartmentSchema);