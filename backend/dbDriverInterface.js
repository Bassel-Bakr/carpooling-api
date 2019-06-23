class DatabaseDriverInterface {
    constructor() {}

    connect() {}

    getUser() {}

    addUser() {}

    getUserById(id, callback) {}
    
    getUserByName(name, callback) {}
}

module.exports = DatabaseDriverInterface;