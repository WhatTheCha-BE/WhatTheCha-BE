const mongoose = require('mongoose');
const WatchaPartySchema = new mongoose.Schema({
    partyTitle: String,
    movieId: String,
    movieName: String,
    host: String,
    participant: Array,
    card_image: String,
});

module.exports = mongoose.model('watchaparty', WatchaPartySchema);