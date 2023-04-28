const mustNotLogin = (req, res, next) => {
    !req.isAuthenticated() ? next() : res.redirect('/user/profile')
}

module.exports = mustNotLogin