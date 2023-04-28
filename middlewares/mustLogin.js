const mustLogin = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/auth/login')
}

module.exports = mustLogin