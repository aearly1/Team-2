const jwt = require('jsonwebtoken');
const blacklist = []
const config = require("config");
const staffMembers = require('../models/staffMembers');
const key = config.get("jwtSecret")

module.exports.func = async function authenticate(req,res,next){
    if(!req.header('auth-token'))
    return res.status(403).send("Token was not found")
    blacklist.forEach(element => {
        if(element == req.header('auth-token'))
        return res.status(403).send("You already logged out")
    });
    try{
        const decoded = jwt.verify(req.header('auth-token'),config.get("jwtSecret"))
        req.user = decoded.user;
        // console.log(JSON.stringify(req.user))
        // if(!req.user.firstLogin){
        //   console.log("firstLogin: "+req.user.firstLogin)
        //   res.redirect("/passwordReset")
        // }
        let url =req.originalUrl
        if(req.user.firstLogin && url != "/api/staffs/passwordreset" && url != "/api/login")
        res.send("Reset your password")
        else
        next();
    }
    catch(err){
        res.status(403).send("Invalid token")
    }
}
module.exports.key=key;
module.exports.blacklist=blacklist;