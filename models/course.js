const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema(
    {
        courseId: {type:Number, unique:true, required:true},
        courseName: {type:String, required:true},
        instructors: Array, //array stores ids of instructors teaching this course
        teachingAssistants: Array, //array stores ids of teaching assitants of this course
        coordinator: Number, // id of the coordinator of this course
        teachingSlots: [mongoose.Schema.Types.Slot], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
        unassignedSlots: Number, //used to calculate the course coverage
    }
);
module.exports= mongoose.model("course",CourseSchema);