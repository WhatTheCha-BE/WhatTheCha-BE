const express = require("express");
const router = express.Router();
const authMiddelware = require("../middelwares/auth-middleware");

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
    }
});


//보고싶어요:리스트
router.get("/content/want", async (req, res) => {
  try{
      const { profileName } = req.body;
      console.log("1111req.body 리스트:", req.body);
      console.log("1111profileName 리스트:", profileName);
      console.log("1111profileName타타입 리스트:", typeof(profileName));
      

    } catch (err) {
      res.status(400).json({
        ok:false,
        errorMessage: "보고싶어요 리스트 실패"
      });

    } 
  });
  
  
//이어보기:리스트
router.get("/content/continue", async (req, res) => {
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
    }
});


//다 본 작품:리스트
router.get("/content/complete", async (req, res) => {
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
  }
});


//평가한 작품 선택
router.get("/content/doneEvaluation", async (req, res) => {
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
  }
});


// //보고싶어요 누르기
// +1, -1로 설정하기
router.post("/content/detail/movieId/want", async (req, res) => {
  try {
    const { movieId, profileName } = req.body;

    res.status(200).json({
      ok: true,
      message: "보고싶어요 등록 성공",
});
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "보고싶어요 등록 실패",
    });

  }
});


//평가 누르기
//+1만 가능하게 수정하기
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
      }
});

module.exports = router;