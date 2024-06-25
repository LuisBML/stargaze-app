import User from '../models/userModel.js';

const userController = {};

userController.registerForm = (req, res) => {
    res.render('user-views/register')
};

userController.loginForm = (req, res) => {
    res.render('user-views/login')
}

userController.newUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${registeredUser.username}!`)
            res.redirect('/places');
        });
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register');
    }
};

userController.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/places';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

userController.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/places');
    });
}

export default userController;