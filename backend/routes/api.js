module.exports = function (database) {
    const express = require("express");
    const router = express.Router();
    const errors = require("../../middle/errors");
    const api = require("../api")(database);

    router.get("/route", (req, res) => {
        const query = req.query;
        api.getRoute(query).then(route => res.json(route)).catch(err => { console.log(err); res.status(500).end() });
    });

    return router;
}