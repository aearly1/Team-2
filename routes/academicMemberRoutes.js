const express = require('express');
const router = express.Router();
const course = require('../models/course.js');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')

module.exports=router;

router.route('/replacementRequest')
.get(async(req,res)=>{

})