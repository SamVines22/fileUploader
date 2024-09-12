const {Router} = require("express");
const routes = Router();
const controllers = require("../controllers/controllers");
const passport = require("../prisma/pool");
const isAuthenticated = require("../middleware/middleware").isAuthenticated;
const upload = require("../multer/multer");



routes.get("/", controllers.index);
 routes.post("/login", passport.authenticate("local", {
     successRedirect: "/seeFiles",
     failureRedirect: "/"
 }));

routes.get("/signup", controllers.signup);
routes.post("/signup", controllers.signupPost);
routes.get("/uploadfiles", isAuthenticated,controllers.files);
routes.get("/logout", controllers.logout);
routes.post("/uploadfiles", upload, controllers.fileUpload);
routes.get("/seefiles", controllers.seeAllFiles);
routes.get("/file/:fileId", controllers.seeOneFile);
//routes.post("/seefiles/:itemId", controllers.addToFolder);
routes.get("/folders", controllers.seeFolders);
routes.post("/folders", controllers.addNewFolder);
routes.get("/folders/:folderId", controllers.seeOneFolder);
routes.post("/addfile/:folderId", controllers.addToFolder);
routes.post("/removefile/:folderId", controllers.removeFromFolder);
routes.get("/download/*", controllers.fileDownload);


module.exports = routes;