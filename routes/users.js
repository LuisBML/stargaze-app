import express from 'express';
import returnToMiddleware from '../helpers/returnToMiddleware.js';
import passport from 'passport';
import userController from '../controllers/userController.js';

const router = express.Router();

router.route('/register')
    .get(userController.registerForm)
    .post(userController.newUser);

router.route('/login')
    .get(userController.loginForm)
    .post(returnToMiddleware, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', userController.logoutUser);

export default router;