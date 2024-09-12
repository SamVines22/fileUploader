const express = require("express");
const app = express();
const path = require("node:path");
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require("./prisma/pool.js");
const port = process.env.PORT || 3000;
const Allrouters = require("./routes/routes.js");
//const db = require("./prisma/queries.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"./views"));

// app.use(expressSession({secret:"cats", resave:"false", saveUnititialized: "false"}));
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
// app.use(async (req,res,next)=> {
//   console.log("gimp");
//   const id = req.session.passport.user;
//   const users = new db;
//   const user = await users.getUser(id);
//   console.log(user)
//   next();
// })


app.use("/", Allrouters);








app.listen(port, ()=>console.log(`server open on port ${port}`));