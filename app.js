const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

const connect = require('./schemas');
connect();

const requestMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
};

app.use(express.json());
app.use(requestMiddleware);

//router 가져오기
const contentRouter = require('./routes/content');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const videoRouter = require('./routes/video');

app.use('/', express.urlencoded({ extended: false }), [
  contentRouter,
  profileRouter,
  userRouter,
  videoRouter,
]);

app.listen(port, () => {
  console.log(
    `listening at http://localhost:${port} : 포트로 서버가 열렸어요!!`
  );
});
