// require('dotenv').config();

const express        = require('express');
const app            = express();
// const bodyParser  = require('body-parser');
const port           = process.env.PORT || 4000;
const session        = require('express-session');
const passport       = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const profileRoutes = require('./api/routers/profileRoutes');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(require('cookie-parser')());
app.use(session({
    secret: "thesecret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback" // change this when you're deploying
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
}));
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// })

app.use(profileRoutes);


app.listen(port, () => console.log('listening on port: ' + port));

