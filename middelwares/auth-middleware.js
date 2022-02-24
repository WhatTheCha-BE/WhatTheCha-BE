const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const { email } = req.headers;
    console.log('미들웨어: ', authorization, email);
    const [tokenType, tokenValue] = authorization.split(' ');
    console.log('tokenType: ',tokenType, 'tokenValue: ', tokenValue);

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요.',
        });
        console.log('tokenType !== Bearer')
        return;
    }

    
    try {
        const { user_id } = jwt.verify(tokenValue, process.env.TOKENKEY);
        User.findById(user_id).exec().then((user) => {
            console.log('user: ',user)
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요!',
        });
        console.log('err', error);
        return;
    };
};