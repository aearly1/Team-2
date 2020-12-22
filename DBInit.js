const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const course = require('../models/course');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');

router.route('/')
//DB initialization
.post(async(req,res)=>{

})
module.exports=router;