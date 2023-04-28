var express = require('express');
var router = express.Router();
var { User } = require('../models')
var { roles } = require('../utils/roles')

router.get('/users', async(req, res, next) => {
    try{
        var users = await User.findAll()
        res.render('manage-users', {users})
    }catch(error){
        next(error)
    }
})

router.get('/user/:id', async(req, res, next) => {
    try{
        var { id } = req.params;
        var person = await User.findByPk(id);

        if(!person){
            req.flash('error', 'Invalid id!')
            res.redirect('/admin/users')
            return;
        }

        res.render('profile', {person})
    }catch(error){
        next(error)
    }
})

router.post('/update-role', async(req, res, next) => {
    try{
        var { id, role } = req.body;
        // JIKA ID ATAU ROLE NYA TIDAK ADA
        if(!id || !role){
            req.flash('error', 'Invalid request!')
            return;
        }
        var user = await User.findOne({where: {id: id}})
        if(!user){
            req.flash('error', 'Invalid id')
            return;
        }
        var arrayRoles = Object.values(roles);
        if(!arrayRoles.includes(role)){
            req.flash('error', 'Invalid role')
            return;
        }
        if(req.user.id === id){
            req.flash('error', 'Admin cannot removed themselves, ask to another admin!')
            return;
        }
        await User.update({role: role}, {where:{id:id}})
        req.flash('success', 'success updated role')
        res.redirect('/admin/users')
    }catch(error){
        next(error)
    }
})

module.exports = router;