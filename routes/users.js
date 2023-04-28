var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/profile', function(req, res, next) {
  var person = req.user;
  res.render('profile', {person});
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if(err){
      req.flash('error', `${err}`)
      return next(err)
    }
  })
  res.redirect('/')
})

module.exports = router;