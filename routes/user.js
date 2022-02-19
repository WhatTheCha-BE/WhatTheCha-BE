const express = require("express");
const User = require('../schemas/users');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const authMiddelware = require('../middelwares/auth-middleware');

const router = express.Router();

const UsersSchema = Joi.object({
    user_id: Joi.string().alphanum().min(3).max(30).required(),
    nickname: Joi.string().required(),
    pw: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
    pw2: Joi.string().required(),
});

//회원가입

router.post('users/signup', async (req, res) => {
    try{
        const { email, password, confirmpassword } = await UsersSchema.validateAsync(req.body);
        
        if(password !== confirmpassword){
            res.status(400).send({
                errorMessage: '비밀번호가 일치하지 않습니다!',
            });
            return;
        }

        const existEmail = await User.find({ email });

    }catch{

    }
})


module.exports = router;
