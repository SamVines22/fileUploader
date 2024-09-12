function isAuthenticated(req,res,next) {

    if (req.isAuthenticated()){
        next();
    }
    else {
        res.render("unauthorized");
    }
}

module.exports = {
    isAuthenticated
}