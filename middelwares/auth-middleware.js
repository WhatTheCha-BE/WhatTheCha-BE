const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const { email } = req.headers;
    console.log('미들웨어: ', authorization, email);
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요.',
        });
        return;
    }

    try {
        const { user_id } = jwt.verify(tokenValue, process.env.TOKENKEY);
        User.findById(user_id).exec().then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요!',
        });
        return;
    };
};