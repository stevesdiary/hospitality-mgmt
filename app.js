const  express = require ("express");
const  { Sequelize } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const mysql = require('mysql');
const env = require("dotenv").config();
const fs = require('fs/promises');
const cors = require ("cors");
const helmet = require('helmet')
const db = require('./config/db')
const app = express();
const path = require("path");
const multer = require("multer");
const bodyParser = require('body-parser');
const port = process.env.LOCAL_PORT || 3000 ;
require('dotenv').config();

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   secure: true,
});
const options = {
   use_filename: true,
   unique_filename: false,
   overwrite: false,
};
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads');
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));  
   }
});

let upload = multer({
   storage: storage,
   // limits: {fileSize: 1000000},
})
app.get('/', (req, res) => {
   res.send("Description.")
})
app.post('/upload', upload.single('image'), async(req, res) => {
   try {
      let imagePath = "./uploads/" + req.file.filename;
      
      // console.log('Upload status', imagePath)
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log("Upload successful! Here's the image url: ", result.secure_url)
      await fs.unlink("./uploads/" + req.file.filename, (err) => {
         if (err) {
            console.error(err);
         }
         console.log('File deleted successfully');
      });
      return res.status(200).send({message: "Upload Successful", result: result.secure_url});
      
   }
   catch(err) {
      console.log(err)
   }
});

app.listen(port, async() => {
   console.log('App running on port: ' + port)
})