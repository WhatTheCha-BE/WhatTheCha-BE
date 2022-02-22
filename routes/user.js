const express = require("express");
const User = require("../schemas/users");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const authMiddelware = require("../middelwares/auth-middleware");

const router = express.Router();

const UsersSchema = Joi.object({
  email: Joi.string()
    .pattern(
      new RegExp(
        "^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(.[0-9a-zA-Z_-]+){1,2}"
      )
    )
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(),
  confirmpassword: Joi.string().required(),
});

//회원가입      !! 이메일 형식 유효성 검사

router.post("/users/signup", async (req, res) => {

  try {
    console.log('/users/signup')
    const { email, password, confirmpassword } =
      await UsersSchema.validateAsync(req.body);

    if (password !== confirmpassword) {
      res.status(400).send({
        errorMessage: "비밀번호가 일치하지 않습니다!",
      });
      return;
    }
    // 이메일 유효성검사
    const existEmail = await User.find({ email });
    if (existEmail.length) {
      res.status(400).send({
        errorMessage: "이미 사용중인 이메일입니다.",
      });
      return;
    }

    const user = new User({
      email: email,
      password: password,
      profileName: [],
    });
    await user.save();

    res.status(201).send({
      ok: true,
      message: "회원가입 성공",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//로그인 조이
const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(
      new RegExp(
        "^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(.[0-9a-zA-Z_-]+){1,2}"
      )
    )
    .required(),
  password: Joi.string().pattern(new RegExp("^[0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?\\s]$")).required(),
});
//로그인 라우터
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    const user = await User.findOne({ email });

    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "아이디 또는 패스워드를 확인해주세요",
      });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.TOKENKEY);
    res.send({
      token,
      email,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.get('/users/me', authMiddelware, async (req, res) => {
  // const { token } = res.locals;
  res.send({
    ok:'true',
    message:'token check ok'
  })
})

module.exports = router;
