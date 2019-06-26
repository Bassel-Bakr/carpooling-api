const DatabaseDriverInterface = require("./dbDriverInterface");
const errors = require("../middle/errors");

class LocalDriver extends DatabaseDriverInterface {
    constructor() {
        super();
        console.log("using local db driver");

        this.users = [{
                id: 1,
                name: "Bassel",
                email: "basselbakr@gmail.com",
                password: "a"
            },
            {
                id: 2,
                name: "Hossam",
                email: "ConanCode96@gmail.com",
                password: "a"
            }
        ]

        this.counter = 3;
        this.defaultCallback = function () {};
    }

    connect(callback) {
        // no such thing as connecting
    }

    addUser(user, callback) {
        if (!callback) callback = this.defaultCallback;

        // TODO: validate
        let usr = this.users.filter(u => u.name == user.name);

        // exists?
        if (usr.length == 1)
            return callback(null, errors.database.exists);

        this.users.push({
            id: this.counter++,
            name: user.name,
            password: user.password
        });

        usr = this.users.filter(u => u.name == user.name);

        if(usr.length == 1)
            callback(null, errors.database.created);
        else
            callback(errors.database.failed, null);
    }

    getUserById(id, callback) {
        // TODO: validate input and protect against sql injection
        if (!callback) callback = this.defaultCallback;
        if (!Number.isInteger(id))
            throw "sql injection!!!";
        else
            callback(null, this.users.filter(user => user.id == id)[0]);

    }

    getUserByName(name, callback) {
        // TODO: validate input and protect against sql injection
        if (!callback) callback = this.defaultCallback;
        callback(null, this.users.filter(user => user.name == name)[0]);
    }
}

module.exports = LocalDriver;