const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/TheCha', {
    })
    .catch(err => console.log(err));
};

mongoose.connection.on('error', err => {
    console.error('몽고디비 연결 에러!', err);
});

module.exports = connect;