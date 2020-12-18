const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const departmentModel = require('../models/depratment');
const courseModel = require('../models/course');
const staffModel = require('../models/staffMembers');



// @route   POST api/HOD/assign-instr-course
// @input   course id, instructor id
// @desc    Assign a course instructor for each course in his department.
// @access  Private
router.get("/assign-instr-course", auth, async (req, res) => {
    try {
        const department = await departmentModel.find({HOD_id : req.user.id});

        res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/HOD/assign-instr-course
// @input   course id, instructor id
// @desc    delete a course instructor for each course in his department.
// @access  Private
router.get("/del-instr-course", auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });

        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/HOD/update-instr-course
// @input   course id, instructor id
// @desc    Assign/delete/update a course instructor for each course in his department.
// @access  Private
router.put("/update-instr-course", auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });

        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/staff
// @input   -
// @desc    View all staff members
// @access  Private
router.get("/staff", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route   GET api/hod/staff-s
// @input   staff member id  
// @desc    View one staff members
// @access  Private
router.get("/staff-s", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/staff-do
// @input   -
// @desc    View the day off of all the staff in his/her department.
// @access  Private
router.get("/staff-do", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/staff-dos
// @input   staff member id  
// @desc    View the day off of a single staff in his/her department.
// @access  Private
router.get("/staff-dos", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/leave-reqs
// @input   -
// @desc    View all the requests “change day off/leave” sent by staff members 
//          in his/her department
// @access  Private
router.get("/leave-reqs", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/hod/leave-req-a
// @input   req-id
// @desc    Accept a request. if a request is accepted, appropriate logic should be
//          executed to handlethis request.
// @access  Private
router.post("/leave-req-a", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/hod/leave-req-r
// @input   req-id
// @desc    Reject a request, and optionally leave a comment as to why this
//          request was rejected
// @access  Private
router.post("/leave-req-r", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/course-cov
// @input   course-id
// @desc    View the coverage of each course in his/her department
// @access  Private
router.get("/course-cov", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/hod/teaching-assignments
// @input   course-id  
// @desc    View teaching assignments (which staff members teach which slots) 
//          of course offered by his department.
// @access  Private
router.get("/teaching-assignments", auth, async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



module.exports = router;