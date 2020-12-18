const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseName: {type:String, required:true},
        instructors: [mongoose.Types.ObjectId], //array stores ids of instructors teaching this course
        teachingAssistants: [mongoose.Types.ObjectId], //array stores ids of teaching assitants of this course
        coordinator: mongoose.Types.ObjectId, // id of the coordinator of this course
        teachingSlots: [mongoose.Types.ObjectId], //array that stores all the slots of the course (whether or not they have been assigned to staff members)
        unassignedSlots: Number, //used to calculate the course coverage
    }
);
module.exports= mongoose.model("course",CourseSchema);