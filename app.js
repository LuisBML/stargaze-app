import express from 'express';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
import ExpressMongoSanitize from 'express-mongo-sanitize';
// The flash is a special area of the session used for storing messages.
import flash from 'connect-flash';
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
import methodOverride from 'method-override';
// Helps secure Express apps by setting HTTP response headers
import helmet from 'helmet';

import ExpressError from './helpers/ExpressError.js';
import User from './models/userModel.js';

import placesRoutes from './routes/places.js';
import reviewsRoutes from './routes/reviews.js';
import usersRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config();

// ----------------------------------------------------------------------------------
// MongoDB
mongoose.connect('mongodb://localhost:27017/stargaze-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', () => {
    console.log('Database connected');
});
// ----------------------------------------------------------------------------------

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(ExpressMongoSanitize());

const sessionConfig = {
    name: 'sessionplace',
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

// ----------------------------------------------------------------------------------
// Helmet
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDNAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// ----------------------------------------------------------------------------------
// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ----------------------------------------------------------------------------------

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', usersRoutes);
app.use('/places', placesRoutes);
app.use('/places/:placeId/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'The page you are looking for was not found.'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});