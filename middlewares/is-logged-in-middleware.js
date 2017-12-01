// check to see if user is logged in
const passport = require('passport');
const jwt = require('jsonwebtoken');


module.exports = function loggedIn(req, res, next) {
    passport.authenticate('jwt', {session: false});
    next();

    // if (req.data.username) {
    //     next();
    // } else {
    //     res.redirect('/login');
    // }
}


