const { urlencoded } = require("express");
const express = require("express");
const router = express.Router();
const authMiddelware = require("../middelwares/auth-middleware");
const { exist } = require("joi");

const { $where } = require("../schemas/contents");
const Content = require("../schemas/contents");
const ExclusiveContent = require('../schemas/exclusiveContent')
const TitleContent = require('../schemas/titleContent')
const WatchaParty = require('../schemas/watchaParty')

const Profile = require("../schemas/profiles");
const User = require("../schemas/users");


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

    const exclusiveList = await ExclusiveContent.find({})
    const titleList = await TitleContent.find({})
    const watchaPartyList = await WatchaParty.find({})

    const dramaList = await Content.find({$or:[ { category: "드라마" }, { category: "단편" } ]}, {_id : false, movieId: true, card_image: true});
    const action_war_List = await Content.find({$or:[ { category: "액션" }, { category: "전쟁" } ]}, {_id : false, movieId: true, card_image: true});
    const comedy_adventure__biography_List = await Content.find({$or:[ { category: "코미디" }, { category: "모험" }, { category: "전기" } ]}, {_id : false, movieId: true, card_image: true});
    const fantasy_crime_romanse_etc_list = await Content.find({$or:[ { category: "판타지" }, { category: "범죄" },{ category: "로맨스" }, { category: "애니메이션" },{ category: "스릴러" }, { category: "SF" }, { category: "미스터리" } ]}, {_id : false, movieId: true, card_image: true});

    const categoryList = {
      drama : dramaList,
      action_war : action_war_List,
      comedy_adventure__biography : comedy_adventure__biography_List,
      fantasy_crime_romanse_etc : fantasy_crime_romanse_etc_list
    };

    res.status(200).json({ listTop, relayList, wantList, exclusiveList, titleList, watchaPartyList, categoryList });
  } catch(error) {
    res.status(400).json({ ok : false })
  }
})


//영상 상세 페이지
router.post("/content/detail", async (req,res) => {
    try{
        const { movieId } = req.body;
        // const content = await Content.findOne({ movieId }, { _id: false });
        const content = await Content.findOne({movieId: Number(movieId)});
        console.log("영상상세보기 content타입:", typeof(content));
        res.status(200).json({
          content,
          ok:true,
          message:"영상 상세보기 성공"
        });
      } catch (err) {
        res.status(400).json({
          ok:false,
          errorMessage: "영상 상세보기 실패"
        });
        console.log(`영상 상세보기에러: ${err}`);
        
    }
});


//보고싶어요:리스트
router.post("/content/want", async (req, res) => {
  try{
      const { profileName } = req.body;
      const want = await Profile.findOne({ profileName }, { _id : false });
      
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
router.post("/content/detail/movieId/want", async (req, res) => {
  try {
    const { movieId, profileName } = req.body;
    console.log(123,req.body);
    console.log("11movieId", movieId);
    console.log("11movieId타입", typeof(movieId));
    console.log("22profileName", profileName);
    console.log("22profileName타입", typeof(profileName));


    const existprofileName = await Profile.findOne({ profileName:profileName }, { _id:false });
console.log(`11existprofileName결과: ${existprofileName}`);
    if (existprofileName.profileName === profileName)
    console.log("33existprofileName: ", existprofileName);
    console.log("33existprofileName.profileName: ", existprofileName.profileName);
    
    await Profile.updateOne({ profileName:profileName }, {$push: {want:movieId}, });
    console.log("44existprofileName: ", existprofileName);
    console.log("44existprofileName.profileName: ", existprofileName.profileName);
    res.status(200).json({
      ok: true,
      message: "보고싶어요 등록 성공",
});
console.log(`existprofileName.want:  ${existprofileName.want}`);
console.log(`existprofileName결과: ${existprofileName}`);
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "보고싶어요 등록 실패",
    });
    console.log(`보고싶어요 에러": ${err}`);
    console.log("보고싶어요typeof:", typeof(myProfileWant));
    console.log(`보고싶어요 Profile.myProfileEvaluation: ${Profile.myProfileEvaluation}`);
  }
});


//평가 누르기
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