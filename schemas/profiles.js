const mongoose = require('mongoose');

const profilesSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    profileName: {
        type: String
    },
    profileImage:{
        type: String
    },

    //이어보기 {key영화:value멈춘지점}
    // listRelay: { 
        // movieId:stopPoint
    //  }, 

    //보고싶어요 누른 영화 목록
    // want : [{ 
    //     movie:{type:String}
    //  }],  
    // https://nesoy.github.io/articles/2017-06/Mongoose-Array
    want : [
        new mongoose.Schema({ 
        movieId:String,
        profileName:String
     })
    ],  

    complete : [{ 
        movieId:String
    }], 

    //영화를 다 본 목록
    doneEvaluation: [{
        movieId:String,
        starRate:String
    }]
});
    
module.exports = mongoose.model("Profiles", profilesSchema);
    