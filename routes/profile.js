const express = require("express");
const Profile = require("../schemas/profiles");
const User = require("../schemas/users");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const auth = require("../middelwares/auth-middleware");
const router = express.Router();

// 프로필 선택 페이지 (해당 계정의 프로필불러오기 (프로필 내부 정보 같이 보내주기 ))
router.get("/profile", auth, async (req, res, next) => {
  // 이메일(로그인 계정)의 해당 프로필들 보내주기
  const { email } = req.headers;

  const checkexist = await User.findOne({ email: email });

  console.log("checkexist:", checkexist);
  console.log("length: ", checkexist.profileName);

  if (checkexist.profileName.length === 0) {
    console.log("생성된 프로필이 없습니다.");
    next();
  }
  const names = checkexist.profileName;
  const profile = {};
  // profile에 Profile DB에서 profileName과 profileImage 담아주기
  for (let i = 0; i < names.length; i++) {
    const findprofile = await Profile.findOne({ profileName: names[i] });
    console.log("profile: ", findprofile);
    profile[i] = {
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
    console.log('body 확인 :', req.body);
    console.log('받았을때 확인: ', profileName, profileImage)
    // const { email } = req.locals;
    const { email } = req.headers;

    console.log("check get email: ", email);

    // email 값 받기
    const checkUser = await User.findOne({ email: email });
    console.log("/profile/create checkpoint", checkUser.profileName);

    if (checkUser.profileName.length > 3) {
      res.status(400).send({
        ok: "false",
        errorMessage: "프로필 생성 실패( 최대 4개 까지 생성가능 )",
      });
      return;
    }
    for (let i = 0; i < checkUser.profileName.length; i++) {
      console.log("profileName: ", checkUser.profileName[i]);
    }

    console.log("update 전");
    await User.updateOne(
      { email: email },
      { $push: { profileName: profileName } }
    );
    console.log("update 후");

    console.log('프로필 저장전 체크: ', profileName, profileImage)
    const profile = new Profile({
      email: email,
      profileName: profileName,
      profileImage: profileImage,
      want: [],
      complete: [],
      doneEvaluation: [],
    });

    console.log(profile);
    // profile.dropIndexes()
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
router.delete("/profile/delete/:profileName", auth, async (req, res) => {
  const { profileName } = req.params;
  const { email } = req.headers;

  const testname = await User.findOne({ email });
  console.log(testname);
  for (let i = 0; i < testname.profileName.length; i++) {
    if (testname.profileName[i] === profileName) {
      console.log(testname.profileName[i]);
    }
  }

  

  try {
    await User.updateOne(
      { email: email },
      { $pull: { profileName: profileName } }
    );
    
    await Profile.deleteOne({ profileName, email });

    res.status(200).send({
      ok: true,
      message: "삭제 성공",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      ok: false,
      errorMessage: "삭제 실패",
    });
  }
});

//프로필 선택( 프론트 에서 알아서 하는? )

module.exports = router;
