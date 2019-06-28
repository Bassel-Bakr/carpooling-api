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
    boss: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    seen: { type: Number, required: true }
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
                            .catch(throwError);
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

    // Driver
    /**
     *
     *
     * @param {*} id
     * @param {*} boss
     * @param {*} latitude
     * @param {*} longitude
     * @param {*} callback
     * @memberof MongoDriver
     */
    updateDriver(id, boss, latitude, longitude, callback) {
        callback = callback || (() => { });
        const seen = (new Date()).getTime() / 1000;
        Driver.updateOne({ id }, { id, boss, latitude, longitude, seen }, { upsert: true })
            .exec()
            .then(callback)
            .catch(throwError);
    }

    getDriverById(id, boss, callback) {
        Driver.findOne({ id, boss })
            .exec()
            .then(callback)
            .catch(throwError);
    }

    getAllDrivers(boss, callback) {
        Driver.find({ boss })
            .exec()
            .then(callback)
            .catch(throwError);
    }

    deleteDriver(id, boss) {
        Driver.deleteOne({ id, boss })
            .exec()
            .catch(throwError);
    }

    deleteAllDrivers(boss) {
        Driver.deleteMany({ boss })
            .exec()
            .catch(throwError);
    }

    /**
     *
     *
     * @param {*} lat1
     * @param {*} lng1
     * @param {*} lat2
     * @param {*} lng2
     * @param {*} seen last time seen
     * @memberof MongoDriver
     */
    getDriversInBox(boss, lat1, lng1, lat2, lng2, seen, callback) {
        const [lt1, lt2] = [Math.min(lat1, lat2), Math.max(lat1, lat2)]
        const [lg1, lg2] = [Math.min(lng1, lng2), Math.max(lng1, lng2)]
        Driver.find({
            boss,
            $and: [
                // lt1 <= latitude <= lt2
                { latitude: { $gte: lt1, $lte: lt2 } },
                // lg1 <= longitude <= lg2
                { longitude: { $gte: lg1, $lte: lg2 } },
                // seen after [seen]
                { seen: { $gte: seen } }
            ]
        })
            .exec()
            .then(callback)
            .catch(throwError);

    }
}

module.exports = MongoDriver;