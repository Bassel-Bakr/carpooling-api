const DatabaseDriverInterface = require("./dbDriverInterface");
const mysql = require("mysql");

class LocalDriver extends DatabaseDriverInterface {
    constructor() {
        super();
        console.log("using local db driver");

        this.users = [{
                id: 1,
                name: "Bassel",
                password: "a"
            },
            {
                id: 2,
                name: "Hossam",
                password: "a"
            }
        ]

        this.counter = 3;
        this.defaultCallback = function () {};
    }

    connect(callback) {
        // just kidding!
    }

    addUser(user, callback) {
        // TODO: validate
        this.users.push({
            id: this.counter++,
            name: user.name,
            password: user.password
        });

        console.log(this.users);

        if (!callback) callback = this.defaultCallback;
        callback();
    }

    getUserById(id, callback) {
        // TODO: validate input and protect against sql injection
        if (!callback) callback = this.defaultCallback;
        if (!Number.isInteger(id))
            throw "sql injection!!!";
        else
            callback(null, this.users.filter(user => user.id == id));

    }

    getUserByName(name, callback) {
        // TODO: validate input and protect against sql injection
        if(!callback) callback = this.defaultCallback;
        callback(null, this.users.filter(user => user.name == name));
    }
}

module.exports = LocalDriver;