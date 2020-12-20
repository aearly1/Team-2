const mongoose = require('mongoose');
const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const course = require('../models/course.js');
const department= require('../models/department.js');
const faculty = require('../models/faculty.js')
const location= require('../models/location.js')
const request = require('../models/request.js')
const slot= require('../models/slot.js')
const staffMembers = require('../models/staffMembers.js');
const key = "qofhiqoh38hfqfh3109fjqpjf";
const blacklist = []
const connectDB = require("../config/db");
const auth = require('../middleware/authenticate.js')
const app= express();
const { body, validationResult, check } = require('express-validator');
module.exports.func = function authenticate(req,res,next){
    if(!req.header('auth-token'))
    return res.status(403).send("Token was not found")
    blacklist.forEach(element => {
        if(element == req.header('auth-token'))
        return res.status(403).send("You already logged out")
    });
    try{
        jwt.verify(req.header('auth-token'),key)
        next();
    }
    catch(err){
        res.status(403).send("Invalid token")
    }
}
module.exports.key=key;
module.exports.blacklist=blacklist