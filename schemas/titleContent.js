const mongoose = require('mongoose');
const titleContentSchema = new mongoose.Schema({
  movieId: String,
  status: String,
  movieName: String,
  detail_text: String,
  card_image: String
});

module.exports = mongoose.model('titleContent', titleContentSchema);