const DatabaseDriverInterface = require("./dbDriverInterface");
const mongoose = require("mongoose");
const errors = require("../middle/errors");
const config = require("./mongoConfig");
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const throwError = (err) => { throw err; };

const User = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    apiKey: { type: String, required: true },
    darkTheme: { type: Boolean, default: true }
}));

const Driver = mongoose.model("driver", new mongoose.Schema({
    id: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    seen: { type: String, required: true }
}));

class MongoDriver extends DatabaseDriverInterface {
    constructor() {
        super();
        console.log("using mongodb driver");
    }

    connect(callback) {
        if (!callback) callback = () => { };
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.connect(`mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`)
            .then(callback())
            .catch(throwError);
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
                { name: user.name },
                { email: user.email }
            ]
        }, (err, instance) => {
            if (err) throw err;
            if (instance) { // user already exists
                console.log(instance);
                callback(null, instance.name == user.name ? errors.database.exists : errors.database.emailExists);
            } else {
                bcrypt.hash(user.password, config.passwordSaltRounds)
                    .then(hash => {
                        user.password = hash;
                        User.create({ ...user, apiKey: uuid() })
                            .then(instance => callback(null, errors.database.created))
                            .catch(err => callback(err, null));
                    })
                    .catch(throwError);

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
        User.findOne({ name })
            .exec()
            .then(instance => {
                if (instance)
                    callback(null, instance);
                else
                    callback(errors.database.notFound, null);
            })
            .catch(throwError);
        console.log("getuserByName");

    }

    getUserByKey(key, callback) {
        // TODO: validate input and protect against sql injection
        User.findOne({ apiKey: key })
            .exec()
            .then(instance => {
                if (instance)
                    callback(null, instance);
                else
                    callback(errors.database.notFound, null);
            })
            .catch(throwError);
    }

    changeTheme(name, isDark) {
        console.log(isDark);
        User.findOneAndUpdate({ name }, { darkTheme: isDark })
            .exec();
    }
}

module.exports = MongoDriver;