const mongoose = require('mongoose');

const playwithSchema = new mongoose.Schema({
  //함께보기 방 생성 영화
  movieId: {
    type: String,
    required: true,
    unique: true,
  },
  //작성자
  profile: {
    type: String,
  },
  //시간
  date: {
    type: String,
  },
  //내용
  text: {
    type: String,
  },
});

module.exports = mongoose.model('Playwith', playwithSchema);
