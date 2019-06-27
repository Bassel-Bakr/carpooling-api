module.exports = (passport, database) => {
    const express = require("express");
    const router = express.Router();
    const errors = require("../../middle/errors");
    const saltRounds = 10;
    const bcrypt = require("bcrypt")


    // router.get("/login", (req, res) => res.render("login"));
    // router.get("/register", (req, res) => res.render("register"));


    router.get("/logout", (req, res) => {
        req.logout();
        res.end(errors.logout.success);
    });

    router.post("/login", (req, res, next) => {
        console.log("login route");
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return res.status(401).end(errors.login.failed, info);
            }
            if (!user) {
                return res.status(401).end(errors.login.notFound, info);
            }
            req.login(user, err => {
                res.status(200).end(errors.login.success);
            });
        })(req, res, next);
    });

    router.post("/register", (req, res) => {
        // check if user already exists
        // TODO: make it client side
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        database.getUserByName(name, (queryErr, queryRes) => {
            if (!queryErr && queryRes) {
                res.end(errors.register.exists);
            } else {
                database.addUser({
                    name,
                    email,
                    password
                }, (regErr, regRes) => {
                    if (regErr)
                        res.status(401).end(JSON.stringify(regErr));
                    else
                        res.status(201).end(regRes);
                });
            }
        });
    });

    return router;
}