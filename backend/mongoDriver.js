const DatabaseDriverInterface = require("./dbDriverInterface");
const mongoose = require("mongoose");
const errors = require("../middle/errors");
const config = require("./mongoConfig");

const User = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
}));

class MongoDriver extends DatabaseDriverInterface {
    constructor() {
        super();
        console.log("using mongodb driver");
    }

    connect(callback) {
        mongoose.connect(`mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`, { useNewUrlParser: true });
        this.connection = mongoose.connection;
        this.connection.on("error", err => {
            console.error("Mongo Connection failed!");
        });
    }

    addUser(user, callback) {
        // TODO: validate
        // check first
        User.findOne({
            $or: [
                {name: user.name},
                {email: user.email}
            ]
        }, (err, instance) => {
            if (instance) { // user already exists
                console.log(instance);
                callback(null, instance.name == user.name ? errors.database.exists : errors.database.emailExists);
            } else {
                User.create(user, (err, instance) => {
                    // console.log(err);
                    if (err)
                        callback(err, null);
                    else
                        callback(null, errors.database.created);
                })
            }
        });
    }

    getUserById(id, callback) {
        // TODO: validate input and protect against sql injection
        User.findById(id, (err, instance) => {
            if (err)
                callback(err, null);
            else if (instance)
                callback(null, instance);
            else
                callback(errors.database.notFound, null);
        });
    }

    getUserByName(name, callback) {
        // TODO: validate input and protect against sql injection
        User.findOne({ name }, (err, instance) => {
            if (err)
                callback(err, null);
            else if (instance)
                callback(null, instance);
            else
                callback(errors.database.notFound, null);
        });
    }
}

module.exports = MongoDriver;