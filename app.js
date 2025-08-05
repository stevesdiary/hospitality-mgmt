const express = require("express");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const forgotPasswordRoute = require("./routes/forgotPassword");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
// const passwordResetRoute = require('./routes/passwordReset');
const userRoute = require("./routes/user");
const hotelRoute = require("./routes/hotel");
const roomRoute = require("./routes/room");
const facilityRoute = require("./routes/facility");
const ratingsRoute = require("./routes/ratingsAndReviews");
const reservationRoute = require("./routes/reservation");
const path = require("path");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const sequelize = require("./config/dbConfig");
const port = process.env.LOCAL_PORT || 3000;

// In your route setup
const rateLimit = require("express-rate-limit");

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many password reset attempts, please try again later",
});

// Apply to your route
router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  passwordResetController.resetPassword
);
require("dotenv").config();
// const routes = require("./routes");
cloudinary.config({
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const options = {
  useFilename: true,
  uniqueFilename: false,
  overwrite: false,
};
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({
  storage: storage,
  // limits: {fileSize: 1000000},
});
app.use("/", registerRoute);
app.use("/", loginRoute);
// app.use('/', passwordResetRoute);
app.use("/", forgotPasswordRoute);
app.use("/", userRoute);
app.use("/", hotelRoute);
app.use("/", roomRoute);
app.use("/", facilityRoute);
app.use("/", ratingsRoute);
app.use("/", reservationRoute);
app.get("/test", (req, res) => {
  res.send("Description.");
});
app.get("/", (req, res) => {
  res.status(200).json("Welcome to Hotel management platform!");
});
// app.post('/cron', async (req, res) =>{
//    try{
//       cron.schedule('*/2 * * * *', () => {
//          console.log('running a task every two minutes');
//       });
//       return res.send({message: 'crone job running'});
//    }
//    catch(err){
//       res.send({message: `An error ocoured`, Error: err})
//    }
// });
app.post(
  "/upload",
  upload.single("image", { folder: "hotels-ng" }),
  async (req, res) => {
    try {
      let imagePath = "./uploads/" + req.file.filename;

      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(
        "Upload successful! Here's the image url: ",
        result.secureUrl
      );
      await fs.unlink("./uploads/" + req.file.filename, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("File deleted successfully");
      });
      return res
        .status(200)
        .send({ message: "Upload Successful", result: result.secure_url });
    } catch (err) {
      console.log(err);
    }
  }
);

app.listen(port, async () => {
  sequelize.authenticate();
  console.log(`App running on port ${port}`);
});

module.exports = app;
