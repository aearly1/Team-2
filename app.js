const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const auth = require("./middleware/auth");

const app = express();
//Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended: false}));

//Define Routes
app.use("/api/user", require("./routes/user")); // to test registeration till Saeed adds HR
app.use("/api/login", require("./routes/login"))
app.use(auth.func)
app.use("/api/staffs",require("./routes/staffRoutes"))
app.use("/api/hod", require("./routes/HOD"));
app.use("/api/hr", require("./routes/HRRoutes"));
app.use("/api/academicMember",require("./routes/academicMemberRoutes"));
app.use("/api/coordinator", require("./routes/courseCoordinatorRoutes"));
app.use("/api/instructor"),require("./routes/courseInstructorRoute");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
