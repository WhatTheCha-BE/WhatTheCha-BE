const { array } = require('joi');
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

    //이어보기 
    listRelay: { 
        type: Array
     }, 

    //보고싶어요 누른 영화 목록
    want :{ 
        type: Array
    },  
    
    complete : { 
        type: Array
    }, 

    //영화를 다 본 목록
    doneEvaluation: Array
});
    
module.exports = mongoose.model("Profiles", profilesSchema);