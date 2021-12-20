const mongoose = require('mongoose');
const config = require('config')
const connect = () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    const dbUri = config.get('dbUri')
    return mongoose
        .connect(dbUri, options)
        .then(() => {
            console.log('connect success');
        })
        .catch((err) => {
            console.log('connect false');
            console.log(err.message);
        });
}

module.exports = connect
