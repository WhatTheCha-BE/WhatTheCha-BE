const mongoose = require('mongoose');

const contentsSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
        unique: true
    },
    movieName: {
        type: String
    },
    //url
    image: {
        type: String
    },
    category: {
        type: String
    },
    actor: [{ 
        type: String
    }],
    detail: {
        type: String
    },
    starRate: {
        type: String
    }
});

module.exports = mongoose.model("Contents", contentsSchema);