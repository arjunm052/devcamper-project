const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Load Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File Upload
app.use(fileUpload());

// Set static Folder
app.use(express.static(path.join(__dirname, "public")));

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

//Get a Port Number
const PORT = process.env.PORT || 5000;

//Start up the server
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
