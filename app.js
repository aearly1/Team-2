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
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use(auth)
app.use("/api/hod", require("./routes/HOD"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



/* OLD CODE */
// const MongoURL = process.env.DB_URL_TEST;
// mongoose.connect(MongoURL, { useNewUrlParser: true,useUnifiedTopology: true })
// .then(()=>{//idk if putting async here is enough
//     console.log('Mongo Connected')
//     const app= express();
//     app.use(express.json());
//     app.use("", authRoutes);
//     /*app.use(async (req, res, next) => {
//         const token = req.headers.token;
//         // TODO deny access if token does not exist
//         req.user = jwt.verify(token, process.env.TOKEN_SECRET);
//         next();
//        });*/
       
//     /*this is where we will add our routes*/
//     app.use("/api/users", require("./routes/users"));
//     app.use("/api/auth", require("./routes/auth"));
//     app.use("/api/contacts", require("./routes/contacts"));



//     app.listen(3000,function()
//     {
//         console.log("Server started at port 3000");
//     });

// })
// .catch((err)=>{
//     console.log(err)
// })

