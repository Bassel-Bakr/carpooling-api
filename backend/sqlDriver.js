const DatabaseDriverInterface = require("./dbDriverInterface");
const mysql = require("mysql");

class SqlDriver extends DatabaseDriverInterface {
    constructor() {
        super();
        console.log("using sql db driver");
        this.user = "root";
        this.password = "root";
        this.db = "test";
        this.table = "users";
    }

    connect(callback) {
        const connection = mysql.createConnection({
            host: "localhost",
            user: this.user,
            password: this.password
        });
        connection.connect((err) => {
            if (err) throw err;
            connection.query("use test;");
            this.connection = connection;
        });
    }

    addUser(user, callback) {
        // TODO: validate
        this.connection.query(`insert into ${this.table}(name, password) values('${user.name}', '${user.password}');`, (err, res) => callback(err, res));
    }

    getUserById(id, callback) {
        // TODO: validate input and protect against sql injection
        if (!Number.isInteger(id))
            throw "sql injection!!!";
        else
            this.connection.query(`select * from ${this.table} where id = ${id}`, (err, res) => {
                callback(err, res);
            });
    }

    getUserByName(name, callback) {
        // TODO: validate input and protect against sql injection
        this.connection.query(`select * from ${this.table} where name = '${name}'`, (err, res) => {
            callback(err, res);
        });
    }
}

module.exports = SqlDriver;