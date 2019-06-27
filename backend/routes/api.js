module.exports = function (database) {
    const express = require("express");
    const router = express.Router();
    const errors = require("../../middle/errors");
    const api = require("../api")(database);
    const constants = require("../../middle/apiConstants");


    const checkers = {
        point(obj, name) {
            const p = obj[name];
            let okay = false;
            if (p) {
                const tokens = p.split(',');
                if (tokens.length == 2) {
                    let [lat, lng] = tokens.map(x => Number(x));
                    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                        okay = (Math.abs(lat) <= 90 && Math.abs(lng) <= 180);
                    }
                }

            }
            return okay;
        },
        vehicle(obj) {
            return obj.vehicle && constants.vehicleTypes.find(v => v.name == obj.vehicle);
        }
    }

    /**
     * get route between 2 points
     */
    router.get("/route", (req, res) => {
        const query = req.query;
        const user = req.apiHolder;
        console.log(user);
        // validate
        if (checkers.point(query, "from") &&
            checkers.point(query, "to") &&
            checkers.vehicle(query)) {
            api.getRoute(query).then(route => res.json(route)).catch(err => { console.log(err); res.status(500).end() });
        } else {
            res.status(403).end(errors.api.invalidFormat);
        }
    });

    /**
     * update driver location with [id, latitude, longitude]
     */
    router.post("/update_driver", (req, res) => {
        const query = req.query;
        res.json(query);
    });

    return router;
}