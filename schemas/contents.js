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
    card_image: {
        type: String
    },
    back_image: {
        type: String
    },
    title_image: {
        type: String
    },
    average_star: {
        type: Number
    },
    director: {
        type: String
    },
    actors: {
        type: Array
    },
    category: {
        type: String
    },
    country: {
        type: String
    },
    make_year: {
        type: String
    },
    detail_text: {
        type: String
    },
    numberOfStarRated: {
        type: String
    },
});

module.exports = mongoose.model("Contents", contentsSchema);