var { roles } = require('../utils/roles')
const ensureModerator = (req, res, next) => {
    if(req.user.role === roles.moderator){
        next()
    }else{
        req.flash('warning', 'you are not Authorized to see this route')
        res.redirect('/')
    }
}

module.exports = ensureModerator()