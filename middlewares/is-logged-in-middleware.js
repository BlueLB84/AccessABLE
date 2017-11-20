// check to see if user is logged in

module.exports = function loggedIn(req, res, next) {
    if (req.data.username) {
        next();
    } else {
        res.redirect('/login');
    }
}


