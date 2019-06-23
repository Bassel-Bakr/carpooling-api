module.exports = (passport) => {
    const express = require("express");
    const router = express.Router();
    // const dbDriver = new require("../sqlDriver");
    // const database = new dbDriver();
    // database.connect();

    router.get("/login", (req, res) => res.render("login"));
    router.get("/register", (req, res) => res.render("register"));


    router.get("/logout", (req, res) => {
        req.logout();
        res.end("logged out");
    });

    router.post("/login", (req, res, next) => {
        // TODO: implement
        // const name = req.body.name;
        // const password = req.body.password;

        // TODO: use passport js for auth
        // database.getUserByName(name, (err, result) => {
        //     if (err || !result || result.length == 0) {
        //         res.status(401).end("no such user");
        //     } else {
        //         res.status(200).end("yo there");
        //     }
        // });

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).end("Cannot login", info);
            }
            req.login(user, err => {
                res.status(200).end("yo there");
            });
        })(req, res, next);
    });

    router.post("/register", (req, res) => {
        // check if user already exists
        // TODO: make it client side
        const name = req.body.name;
        const password = req.body.password;

        database.getUserByName(name, (queryErr, queryRes) => {
            if (!queryErr && queryRes.length == 1) {
                res.end("already registered!");
            } else {
                database.addUser({
                    name,
                    password
                }, (regErr, regRes) => {
                    if (regErr)
                        res.status(401).end("couldn't register user!");
                    else
                        res.status(201).end("registered successfully");
                });
            }
        });
    });

    return router;
}