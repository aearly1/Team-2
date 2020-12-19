//middleware is just a function that has access to
//the request and respone objects

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    //status 401 = unauthorized
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    // console.log(JSON.stringify(req.user))
    // if(!req.user.firstLogin){
    //   console.log("firstLogin: "+req.user.firstLogin)
    //   res.json("User should reset password")
    // }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
