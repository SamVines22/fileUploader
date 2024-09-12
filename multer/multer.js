const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: '../uploads',
    filename: function(req,file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    } 
})

const upload = multer({
    storage: storage,
    limits:{filesize:1000000},
    fileFilter: function(req,file,cb) {
        checkFileType(file,cb);
    }
}).single("file");


function checkFileType (file, cb) {
    const fileTypes = /|jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null,true)
    }
    else { console.log(mimetype); console.log(extname);
        cb("error!!!")
    }
}


module.exports = upload