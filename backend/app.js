// uncomment to disable logging
// console.log = () => {};

// backend framework
const express = require("express");
// config file
const config = require("./config");
// parse request body
const bodyParser = require("body-parser");

// handle auth
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// for presistent sessions
const cookieSession = require('cookie-session')

// for encrypting and decrypting passwords
const bcrypt = require("bcrypt")

// common error messages
const errors = require("../middle/errors");

// app instance
const app = express();

// throw errors
const throwError = (err) => { throw err; };

// database
const dbDriver = require("./dbDriver");
const database = new dbDriver();
database.connect();

// use pug engine
// app.set("view engine", "pug");
// app.set("views", "./public");

// attach body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieSession({
    name: "_jkfhsSESSION",
    keys: ["hjfkah41fd4sf6546ds5f4"],
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}));

// set static files folder
app.use(express.static("./public"));


// init passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({
        usernameField: "name",
        passwordField: "password"
    },
        (username, password, done) => {
            database.getUserByName(username, (err, user) => {
                if (err) {
                    done(null, false, {
                        message: "No such user!"
                    });
                } else {
                    // TODO: validate
                    bcrypt.compare(password, user.password).then(res => {
                        if (res) {
                            done(null, user);

                        } else {
                            done(null, false, {
                                message: "Incorrect username or password!"
                            });
                        }
                    }).catch(throwError);
                }
            });
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("serialize");
    // console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialize");
    database.getUserById(id, (err, user) => {
        if (user) {
            // clone
            let userCopy = JSON.parse(JSON.stringify(user));
            delete userCopy.password;
            done(null, userCopy);
        } else {
            done(null, null);
        }
    });
});

// register routes
bindRoutes(app);

function isAuth(req, res) {
    if (req.isAuthenticated()) {
        const user = JSON.stringify(req.user)
        delete user.password;
        res.status(200).end(user);
    } else {
        res.status(401).end();
    }
}
// am I logged in
app.get("/is_auth", isAuth);

// change last used theme
app.post("/change_theme", (req, res) => {
    console.log("new request")
    if (req.isAuthenticated()) {
        database.changeTheme(req.user.name, req.body.isDark);
        res.status(200).end();
    } else {
        res.status(401).end();
    }
});

function authMiddleware(req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}

function hasCorrectApiKey(req, res, next) {
    const key = req.query.key;
    if (key) {
        database.getUserByKey(key, (err, user) => {
            if (err) {
                res.status(401).end(err);
            } else {
                req.apiHolder = user;
                next();
            }
        });
    } else {
        res.status(401).end(errors.api.keyNotFound);
    }
}

function bindRoutes(app) {
    const authRoutes = require("./routes/auth")(passport, database);
    const apiRoutes = require("./routes/api")(database);
    app.use(authRoutes);
    app.use("/api", hasCorrectApiKey, apiRoutes);
}

// 404 not found handler
app.use((req, res) => res.status(404).end("404"));

// listen to requests
app.listen(config.port);

module.exports = app;