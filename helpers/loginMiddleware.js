const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Prior registration is required');
        return res.redirect('/login');
    }
    next();
}

export default isLoggedIn;
