var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var { User } = require('../models')
var bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    // function(email, password, done){
    //     User.findOne({where: {email: email}}, function(err, user){
    //         if(err){
    //             return done(err)
    //         }
    //         if(!user){
    //             return done(null, false, {message: 'Username/Email not registered'})
    //         }
    //         if(!user.isValidPassword(password)){
    //             return done(null, false, {message: 'Incorrect password'})
    //         }
    //         return done(null, user)
    //     })
    // }
    async(email, password, done) => {
        try{
            const user = await User.findOne({where: {email: email}});
            // JIKA USER TIDAK DITEMUKAN
            if(!user){
                return done(null, false, {message: "Username/email not registered"});
            }
            // PROSES MEMVERIFIKASI PASSWORD REQUEST DENGAN PASSWORD YANG ADA DI DATABASE
            // const isMatch = await User.isValidPassword(password)
            const isMatch = await bcrypt.compare(password, user.password)
            return isMatch ? done(null, user) : done(null, false, {message: "Incorrect password"})
        }catch(error){
            done(error)
        }
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(async(id, done) => {
    try{
        const user = await User.findByPk(id)
        return done(null, user)
    }catch(error){
        return done(error)
    }
});