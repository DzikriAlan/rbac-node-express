var express = require('express');
var router = express.Router();
var passport = require('passport');
var { body, validationResult } = require('express-validator')
var { User } = require('../models')

router.get('/register', async(req, res, next) => {
    res.render('register')
});

router.post('/register', 
[
    // MEMBUAT VALIDASI 
    body('email')
        .trim()
        .isEmail()
        .withMessage('email must be a valid email!')
        .normalizeEmail()
        .toLowerCase()
        .custom(async (value, {req}) => {
            const doesExist = await User.findOne({where: {email: value}});
            if(doesExist){
                throw new Error('Email already exists!')
            }
            return true;
            }),
    body('password')
        .trim()
        .isLength(2)
        .withMessage('Password length short, min 2 char required'),
    body('password2')
        // VALUE = password2
        // {req} = MENCAKUP SEMUA REQUEST MASUK
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Password do not match!')
            }
            return true;
            })
],
async (req, res, next) => {
    try{
        const errors = validationResult(req)

        // JIKA ADA ERRORS
        if(!errors.isEmpty()){
            // MENGIERASI ERRORS YANG ADA DENGAN FOREACH
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            });
            // LALU TAMPILKAN ERRORNYA
            res.render('register', {
                email: req.body.email,
                messages: req.flash()
            })

            return;
        }

        const { email } = req.body;
        const doesExist = await User.findOne({where: {email: email}});
        if(doesExist){
            req.flash('warning', 'Username/Email already exists')
            res.redirect('/auth/register')
            return;
        }

        const user = new User(req.body)
        await user.save()
        req.flash('success', `${user.email} registered success`)
        res.redirect('/auth/login')
    }catch(error){
        next(error)
    }
})

router.get('/login', (req, res, next) => {
    res.render('login')
});

router.post('/login', 
    passport.authenticate('local', {
        successReturnToOrRedirect: '/user/profile',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
)

module.exports = router;