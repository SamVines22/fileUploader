const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');


const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");


// async function main(){
//     const newUser = await prisma.users.create({
//        data: {
//         username: "Lewis",
//         password: "123"
//        }
//     })

//     console.log(`new user created: ${newUser}`);
// }

// main();



passport.use(
    new LocalStrategy(async (username, password, done)=> {
 
        try {
          
           const user = await prisma.users.findUnique({
            where: {username:username}
            
           })
           console.log(user);
            if (!user) {
                return done(null,false, {message: "incorrect username"});
            }
            const match = await bcryptjs.compare(password, user.password);
            if (!match) {
                return done(null, false, {message: "incorrect password"});
            }
            return done(null,user);
        }
        catch(err) {
                return done(null,err);
        }
    })
);

passport.serializeUser((user, done) => {
 
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log(id);
    try {
      const user = await prisma.users.findUnique({
        where: {id:id}
        
      });
      done(null, user);
    } catch(err) {
      done(err);
    }
  });



  module.exports = passport;