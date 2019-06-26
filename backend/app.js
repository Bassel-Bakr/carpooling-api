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
            database.getUserByName(username, (err, user) => {
                if (err || !user) {
                    done(null, false, {
                        message: "No such user!"
                    });
                } else {
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
    // console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialize");
    database.getUserById(id, (err, user) => {
        // console.log(id, user);
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
        delete user.pasword;
        res.status(200).end(user);
    } else {
        res.status(401).end();
    }
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
    const authRoutes = require("./routes/auth")(passport, database);
    const apiRoutes = require("./routes/api")(database);
    app.use(authRoutes);
    app.use("/api", apiRoutes);
}


// 404 not found handler
app.use((req, res) => res.end("Yo world"));

// listen to requests
app.listen(config.port);

module.exports = app;