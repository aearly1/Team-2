const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const auth = require("./middleware/auth");
const cors = require('cors')
const app = express();
//Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended: false}));
app.use(cors())
//Define Routes
app.use("/api/init", require("./DBInit"));
app.use("/api/login", require("./routes/login"))
//app.use(auth.func)
app.use("/api/staffs",require("./routes/staffRoutes"))
app.use("/api/hod", require("./routes/HOD"));
app.use("/api/hr", require("./routes/HRRoutes"));
app.use("/api/academicMember",require("./routes/academicMemberRoutes"))
//app.use("/api/coordinator", require("./routes/courseCoordinatorRoutes"));
app.use("/api/instructor", require("./routes/courseInstructorRoute"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
  
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
  }
  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
