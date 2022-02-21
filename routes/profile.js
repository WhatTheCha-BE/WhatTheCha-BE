const express = require("express");
const Profile = require("../schemas/profiles");
const User = require("../schemas/users");
const Joi = require("Joi");
const jwt = require("jsonwebtoken");
const auth = require("../middelwares/auth-middleware");
const router = express.Router();

// 프로필 선택 페이지 (해당 계정의 프로필불러오기 (프로필 내부 정보 같이 보내주기 ))
router.get("/profile", auth, async (req, res, next) => {
  // 이메일(로그인 계정)의 해당 프로필들 보내주기
  const { email } = req.body;

  const checkexist = User.findOne({ email });
  if (checkexist.profileName.length === 0) {
    next();
  }
  const names = checkexist.profileName;
  const profile = {};
  // profile에 Profile DB에서 profileName과 profileImage 담아주기
  for (let i = 0; i < names.length; i++) {
    const findprofile = await Profile.findOne({ profileName: names[i] });
    profile.i = {
      profileName: findprofile.profileName,
      profileImage: findprofile.profileImage,
    };
  }

  res.send({
    profile,
  });
});

//프로필 생성
router.post("/profile/create", auth, async (req, res) => {
  try {
    const { profileName, profileImage } = req.body;
    const { email } = req.locals;
    // email 값 받기
    const checkUser = await User.findOne({ email });
    if (checkUser.profileName.length > 3) {
      res.status(400).send({
        ok: "false",
        errorMessage: "프로필 생성 실패( 최대 4개 까지 생성가능 )",
      });
      return;
    }
    // users DB에 profileName 추가 (porfile개수 확인용)
    checkUser.profileName.push(profileName);

    const profile = new Profile({
      email: email,
      profileName: profileName,
      profileImage: profileImage,
      want: [],
      complete: [],
      doneEvaluation: [],
    });
    await profile.save();

    res.status(201).send({
      ok: true,
      message: "프로필 생성 완료",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 형식이 올바르지 않습니다.",
    });
  }
});

//프로필 삭제
router.delete('/profile/delete/:profileName', auth, async (req, res) => {
    const { profileName } = req.body;

    const existprofileName = await Profile.findOne({ profileName })
    if(existprofileName){
        
    }
})

//프로필 선택( 프론트 에서 알아서 하는? )

module.exports = router;
