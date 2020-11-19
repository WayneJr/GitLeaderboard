const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const {testReq} = require('../controllers/profileDataController');

router.get('/', (req, res) => {
    // res.sendFile('index.html');
    res.render('index', {user: req.user});
});

router.get('/login', (req, res) => {
    // res.redirect('/auth/github');
    res.render('login', {user: req.user});
    // res.sendFile('pages');
});

router.get('/auth/github',
    passport.authenticate('github', {scope: ['user:email']}),
    (req, res) => {
    // console.log(req.user);
});

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth/github'}),
    (req, res) => {
        // console.log(req.user);
        res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/test', isAuthenticated, (req, res) => {
    testReq(req)
        .then(data => {
            res.json({
                data
            });
            res.statusCode = 200;
        })
        .catch(err => console.log(err));
});

function isAuthenticated(req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/login');

}

module.exports = router;
