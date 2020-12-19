const mongoose = require('mongoose');
const DepartmentSchema = new mongoose.Schema(
    {
        departmentName: {type: String,required:true, default: "New Department"},
        HOD_id: {type: mongoose.Types.ObjectId, required:true},
        courses: [mongoose.Types.ObjectId] //array with course ids of courses belonging to this department
    }
);
module.exports= mongoose.model("Department", DepartmentSchema);