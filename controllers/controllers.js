const db = require("../prisma/queries");
const bcryptjs = require("bcryptjs");
//const upload = require("../multer/multer");
const queries = new db;
const loadCloud = require("../cloudinary/cloudinary");

function downloadurl(url) {
    console.log(url);
    let copy = url;
    let find = /upload/;
    console.log(copy.match(find));
    console.log(copy[48]);
    let first = copy.substring(0,48);
    console.log(first);
    const add = "/fl_attachment";
    last = copy.substring(48);
    console.log(last);
    const newUrl = first + add + last;
    console.log(newUrl);
    return newUrl;
}


function index(req, res) {
   
    
    res.render("index", {user:req.user});
}

function logout(req,res,next) {
    req.logout((err)=> {
        if (err) {
            return next(err);
        }
        else {
            res.redirect("/");
        }
    });
}

function signup (req,res) {
    
    res.render("signup");
}

async function signupPost(req,res) {
    
    console.log("signup post");
    bcryptjs.hash(req.body.password, 10, async(err,hashedPassword)=> {
        if(err){
            return err;
        }
        else {
            try {
            
           await queries.createUser(req.body.username, hashedPassword);
           res.redirect("/");
            }
            catch(err) {
                res.send("error!");
            }
        }
    })
}

async function files(req,res) {
    
    res.render("files", {user: req.user});

}

async function fileUpload(req,res) {
    //console.log(req.file);
  //  await queries.addFile(req.body.fileName,req.body.url);
    const details = await loadCloud(req.file.path);
    const name = req.file.originalname;
    const url = details.url;
    const file = details.format;
    const size = details.bytes;
    queries.addFile(name,url,file,size);
    res.redirect("/seefiles");
}

async function fileDownload(req,res) {
    console.log(req.params);
    res.redirect("/");
}

async function seeAllFiles(req,res) {
    const files = await queries.getAllFiles();
  //  const folders = await queries.getFolders();
    res.render("allFiles", {files:files});
}

async function seeOneFile(req,res) {
    const fileId = parseInt(req.params.fileId);
    let url;
    try {
        const info = await queries.getFileDetails(fileId);     
        const file = info[0].file;
        let folders = [];
        for (let x = 0; x<info.length; x++) {
            folders.push(info[x].folder);
        } 
        url = downloadurl(info[0].file.url);
        res.render("onefile", {file:file, folders:folders, url:url});
    } catch {
        const info = await queries.getFile(fileId);
        console.log(info);
        console.log(info.url);
        const url = downloadurl(info.url);
        res.render("onefile",{file:info, folders:null, url: url});
    }
}

async function seeFolders (req,res) {
    const folders = await queries.getFolders();
    if (folders.length == 0)
        {
           
            res.render("folders", {folders:null});
        }
        else {
          
        res.render("folders", {folders: folders});
        }

}

async function seeOneFolder(req,res) {
    const folderId = parseInt(req.params.folderId);
    const folder = await queries.getOneFolder(folderId);
    let folderName
    try { folderName = folder[0].folder.name; }
    catch {
        folderName = folder.name;
    }
    let files = [];
    for (let x = 0; x<folder.length;x++){
        files.push(folder[x].file)
    }
    const otherFiles = await queries.getOtherFiles(files);
    res.render("onefolder", {folderName: folderName,folderId:folderId, files: files, otherFiles:otherFiles});
}

async function addToFolder(req,res) {
    const fileId = parseInt(req.body.addFile);
    const folderId = parseInt(req.params.folderId);
    await queries.addToFolder(fileId, folderId)
    res.redirect("/folders");
}

async function removeFromFolder(req,res) {
    console.log(req.body);
    const fileId = parseInt(req.body.removeFile);
    console.log(req.params);
    const folderId = parseInt(req.params.folderId);
    await queries.removeFromFolder(fileId,folderId);
    res.redirect("/folders");
}

async function addNewFolder(req,res) {
    await queries.addFolder(req.body.name);
    const folders = await queries.getFolders();
    res.render("folders", {folders:folders});
}

module.exports = {
    index,
    logout,
    signup,
    signupPost,
    files,
    seeAllFiles,
    seeOneFile,
    seeFolders,
    seeOneFolder,
    addNewFolder,
    addToFolder,
    removeFromFolder,
    fileUpload,
    fileDownload
}