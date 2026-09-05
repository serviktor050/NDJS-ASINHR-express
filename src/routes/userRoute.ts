import express = require('express');
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import { findById, findByUsername, verifyPassword, UserRecord } from '../user';

const router: express.Router = express.Router();

const verify: VerifyFunction = (username: string, password: string, done) => {
    findByUsername(username, (err: Error | null, user?: UserRecord | null) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!verifyPassword(user, password)) {
            return done(null, false);
        }
        return done(null, user);
    });
};

const options = {
    usernameField: 'username',
    passwordField: 'password',
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user: UserRecord, cb) => {
    const userRecord = user as UserRecord;
    cb(null, userRecord.id);
});

passport.deserializeUser((id: number, cb) => {
    findById(id, (err: Error | null, user?: UserRecord) => {
        if (err) {
            return cb(err);
        }
        cb(null, user || false);
    });
});

router.get('/login', (_req: Request, res: Response) => {
    res.render('login', {
        title: 'Логин',
    });
});

router.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
        console.log('req.user: ', req.user);
        res.redirect('/');
    }
);

router.get('/me', (req: Request, res: Response) => {
    const user = req.user as UserRecord | undefined;
    if (!user) {
        return res.redirect('/login');
    }

    const { id, username, displayName, email } = user;
    res.render('user/me', {
        title: 'Профиль пользователя',
        id,
        username,
        displayName,
        email,
    });
});

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

export default router;