const user = "bassel";
const password = "abc123";
const url = `mongodb://${user}:${password}@ds119988.mlab.com:19988/users`;

module.exports = {
    port: process.env.PORT || 3000,

    db: {
        user,
        password,
        url
    }
};