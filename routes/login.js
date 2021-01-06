const mongoose = require('mongoose');
const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const staffMembers = require('../models/staffMembers.js');
const connectDB = require("../config/db");
const auth = require('../middleware/auth.js')
const app= express.Router();
const blacklist = auth.blacklist
const key = auth.key
const { body, validationResult, check } = require('express-validator');


    app.post('/',
    [
        body('email').isEmail(),
        body('password').isString().isLength({ min: 5 })
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const staffMem =await staffMembers.findOne({email:req.body.email})
        if(!staffMem)
        return res.status(403).send("The email you entered is not registered")
        const verified = await bcrypt.compare(req.body.password,staffMem.password)
       if(!verified)
       return res.status(403).send("The password you entered is wrong")

        const payload = {user: {
            id: staffMem.id,
            email: staffMem.email,
            name: staffMem.name,
            firstLogin: staffMem.firstLogin,
            type: staffMem.type,
            objectId: staffMem._id
          }
          //,  email:staffMem.email,type:staffMem.type
        }

        const token = jwt.sign(payload,key)
        res.header('auth-token',token)
        //res.redirect(303,'/api/staffs/passwordreset')
        res.status(200).send({token: token})
    })
module.exports = app
