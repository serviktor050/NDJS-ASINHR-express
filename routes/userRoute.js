const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const router = express.Router();
const { findById, findByUsername, verifyPassword } = require('../user');

const verify = (username, password, done) => {
    findByUsername(username, (err, user) => {
        if (err) {return done(err)}
        if (!user) { return done(null, false) }

        if( !verifyPassword(user, password)) {
            return done(null, false)
        }

        return done(null, user)
    })
}

const options = {
    usernameField: "username",
    passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
    findById(id,  (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: "Логин"
    })
})

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("req.user: ", req.user)
        res.redirect('/')
    })

router.get('/me', (req, res) => {
    const {id, username, displayName, email} = req.user;

    res.render('user/me', {
        title: "Профиль пользователя",
        id: id,
        username: username,
        displayName: displayName,
        email: email
    })
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router