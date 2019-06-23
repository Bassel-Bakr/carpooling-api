const express = require("express");
const config = require("./config");
const path = require("path");
const bodyParser = require("body-parser");

const passport = require("passport");
const cookieSession = require('cookie-session')
const LocalStrategy = require("passport-local").Strategy;

// app
const app = express();

// database

const dbDriver = new require("./dbDriver");
const database = new dbDriver();
database.connect();

// use pug engine
// app.set("view engine", "pug");
app.set("views", "./public");

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
            database.getUserByName(username, (err, result) => {
                if (err || !result || result.length == 0) {
                    done(null, false, {
                        message: "No such user!"
                    });
                } else {
                    const user = result[0];

                    // TODO: validate and ues bcrypt
                    if (user.password === password) {
                        done(null, user);
                    } else {
                        done(null, false, {
                            message: "Incorrect username or password!"
                        });
                    }
                }
            });
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("serialize");
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialize");
    database.getUserById(id, (err, result) => {
        console.log(id, result);
        if (result && result.length == 1) {
            let user = result[0];
            delete user.password;
            done(null, user);
        } else {
            done(null, null);
        }
    });
});

// register routes
bindRoutes(app);

function isAuth(req, res) {
    res.status(req.isAuthenticated() ? 200 : 401).end(JSON.stringify(req.user));
}

app.get("/is_auth", isAuth);

function authMiddleware(req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}

function bindRoutes(app) {
    const auth = require("./routes/auth")(passport);
    app.use(auth);
}


// 404 not found handler
app.use((req, res) => res.end("Yo world"));

// listen to requests
app.listen(config.port);

module.exports = app;