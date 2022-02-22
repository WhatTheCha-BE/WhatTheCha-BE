const { urlencoded } = require("express");
const express = require("express");
const { $where } = require("../schemas/contents");
const router = express.Router();
const Content = require("../schemas/contents");
const Profile = require("../schemas/profiles");
const User = require("../schemas/users");
const authMiddelware = require("../middelwares/auth-middleware");
const { exist } = require("joi");


// 메인 페이지 전체 리스트
router.post('/content/list', async (req, res) => {
  try {
    const { profileName, listRelay, want } = req.body;

    const listTop = await Content.find({},{_id : false, movieId: true, card_image: true}).sort('-average_star').limit(10);

    let relayList = [];
    for (let element of listRelay) {
          const movieInfo = await Content.find({movieId: element.movieId}, {_id : false, movieId: true, card_image: true});
          relayList.push(movieInfo);
      };
  
    let wantList = [];
    for (let element of want) {
    const movieInfomation = await Content.find({movieId: element}, {_id : false, movieId: true, card_image: true});
      wantList.push(movieInfomation);
    };

    const dramaList = await Content.find({category: "드라마"}, {_id : false, movieId: true, card_image: true});
    const actionList = await Content.find({category: "액션"}, {_id : false, movieId: true, card_image: true});
    const comedyList = await Content.find({category: "코미디"}, {_id : false, movieId: true, card_image: true});
    const fantasyList = await Content.find({category: "판타지"}, {_id : false, movieId: true, card_image: true});

    const categoryList = {darama : dramaList, action : actionList, comedy : comedyList, fantasy : fantasyList};

    res.status(200).json({ listTop, relayList, wantList, categoryList });
  } catch(error) {
    res.status(400).json({ ok : false })
  }
})


//영상 상세 페이지
router.post("/content/detail/:movieId", async (req,res) => {
    try{
        const { movieId } = req.params;
        console.log(123123,movieId);
        // const content = await Content.findOne({ movieId }, { _id: false });
        const content = await Content.findOne({movieId});
        console.log("11content", content);
        console.log("영상상세보기 content타입:", typeof(content));
        res.status(200).json({
          content,
          ok:true,
          message:"영상 상세보기 성공"
        });
        console.log("영상상세보기 content:", content);
      } catch (err) {
        res.status(400).json({
          ok:false,
          errorMessage: "영상 상세보기 실패"
        });
        console.log(`영상 상세보기에러: ${err}`);
        console.log("영상상세보기 content타입:", typeof(content));
        
    }
});


//보고싶어요:리스트
router.post("/content/want", async (req, res) => {
  try{
      const { movieId } = req.body;
      const want = await Content.findOne({ movieId }, { _id : false });
      
      res.status(200).json({
        want,
        ok:true,
        message: "보고싶어요 리스트 성공"
      });
      console.log(`보고싶어요 리스트 성공: ${want}`);
    } catch (err) {
      res.status(400).json({
        ok:false,
        errorMessage: "보고싶어요 리스트 실패"
      });
      console.log(`보고싶어요 리스트 에러: ${err}`);
    }
  });
  
  
//이어보기:리스트
router.post("/content/continue", async (req, res) => {
    try{
      const { movieId } = req.body;
      const listRelay = await Content.findOne({ movieId }, { _id : false });
      
      res.status(200).json({
        listRelay,
        ok:true,
        message: "이어보기 리스트 성공"
      });
    }catch(err){
      res.status(400).json({
        ok:false,
        errorMessage: "이어보기 리스트 실패"
      });
      console.log(`이어보기 리스트 에러: ${err}`);
    }
});


//다 본 작품:리스트
router.post("/content/complete", async (req, res) => {
  try{
    const { movieId } = req.body;
    const complete = await Content.findOne({ movieId }, { _id : false });

    res.status(200).json({
      complete,
      ok:true,
      message: "다 본 작품 리스트 성공"
    });
  } catch(err){
    res.status(400).json({
      ok:false,
      errorMessage: "다 본 작품 리스트 실패"
    });
    console.log(`다 본 작품 리스트 에러: ${err}`);
  }
});


//평가한 작품 선택
router.post("/content/doneEvaluation", async (req, res) => {
  try{
    const { movieId } = req.body;
    const doneEvaluation = await Content.findOne({ movieId }, { _id : false });

    res.status(200).json({
      doneEvaluation,
      ok:true,
      message: "평가한 작품 리스트 성공"
    });
  } catch(err){
    res.status(400).json({
      ok:false,
      errorMessage: "평가한 작품 리스트 실패"
    });
    console.log(`평가한 작품 리스트 에러: ${err}`);
  }
});


// //보고싶어요 누르기
//1. req.body로 movieId,  profileName 받음
//2.  profileName을 프로필 디비에서 찾고 
//    그 프로필의 want에 movieId를 추가한다.
router.post("/content/detail/movieId/want", async (req, res) => {
  try {
    const { movieId, profileName } = req.body;
    
    const existprofileName = await Profile.findOne({ profileName:profileName }, { _id:false });
console.log(`11existprofileName결과: ${existprofileName}`);
    if (existprofileName.profileName === profileName)
    console.log(123123, existprofileName.profileName);
    console.log(789798, profileName);
    
    await Profile.updateOne({ profileName:profileName }, {$push: {want:movieId}});
    res.status(200).json({
      ok: true,
      message: "보고싶어요 등록 성공",
});
console.log(567567, existprofileName.want);
console.log(`22existprofileName결과: ${existprofileName}`);
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "보고싶어요 등록 실패",
    });
    console.log(`보고싶어요 에러": ${err}`);
    console.log("55보고싶어요typeof:", typeof(myProfileWant));
    console.log("566보고싶어요typeof:", Profile.myProfileEvaluation);
  }
});


//평가 누르기
//1. req.body로 movieId,  profileName 받음
//2.  profileName을 프로필 디비에서 찾고 
//    그 프로필의 doneEvaluation을 찾아서 movieId를 더하기
//post      /content/detail/movieId/star
// router.post("/content/detail/movieId/star", authMiddelware, async (req, res) => {
  router.post("/content/detail/movieId/star", async (req, res) => { 
    try { 
      const { movieId, profileName } = req.body; 
      
      //profileName을 기준으로 doneEvaluation을 찾는다.
      const myProfileprofileName = await Profile.findOne({ profileName:profileName }, { _id: false });
      if (myProfileprofileName.profileName === profileName)
      
      await Profile.updateOne({ profileName:profileName }, {$push: {doneEvaluation:movieId}});
      res.status(200).json({
        ok: true,
        message: "평가 성공",
      });
      } catch (err) {
        res.status(400).json({
          ok: false,
          errorMessage: "평가 실패",
        });
          console.log(`평가 에러: ${err}`);
      }
});

module.exports = router;