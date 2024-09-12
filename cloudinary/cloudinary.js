const cloudinary = require("cloudinary").v2;
require("dotenv").config();


const loadCloud = async function (file) {
    const connectionString = process.env.CLOUDINARY_URL;
    // Configuration
    cloudinary.config({connectionString });
    // Upload an image
     const uploadResult = await cloudinary.uploader.upload(file)
       .catch((error) => {
           console.log(error);
       });
     
    return uploadResult;
  
};

module.exports = loadCloud;