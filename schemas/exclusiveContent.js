const mongoose = require('mongoose');
const exclusiveContentSchema = new mongoose.Schema({
  movieId: String,
  movieName: String,
  card_image: String,
  back_image: String,
  title_image: String,
  average_star: Number,
  director: String,
  actors: Array,
  category: String,
  country: String,
  make_year: String,
  detail_text: String,
  numberOfStarRated: String
});

module.exports = mongoose.model('exclusiveContent', exclusiveContentSchema);