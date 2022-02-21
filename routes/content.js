const { urlencoded } = require("express");
const express = require("express");
const { $where } = require("../schemas/contents");
const router = express.Router();
const Content = require("../schemas/contents");
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
// post    /content/detail/:movieId
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


//보고싶어요:리스트get
// post    /content/want
//프로필스키마 완성되고 다시 확인해 보기!!!
router.post("/content/want", async (req, res) => {
  try{
      const { movieId } = req.body;
      //want배열안에 movieId객체값 가져오기
      // const want = await Profile.findOne({movieId},{ movieId:{"$elemMatch":{"want":"movieId"}} });
      // const want = await Profile.findOne({ want:{$elemMatch:{ movieId }} });
      // const want = await Profile.find( want => want.Object.keys(want));
      // const want = await Profile.find({ where: { movieId } });
      // const want = await Profile.findAll({ where: { movieId } });
      // const want = await Content.findOne({ }, { _id : false });
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
  
  
  //이어보기:리스트get
  //post     /content/continue
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


//다 본 작품:리스트get
//post  /content/complete
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
//post    /content/doneEvaluation
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
// //profileName 프로필디비저장
// //movieId 컨턴츠디비저장
// //바디로 받고, 디비에 저장하고, req로 보내기
// post       /content/detail/movieId/want
router.post("/content/detail/movieId/want", async (req, res) => {
  const { movieId, profileName } = req.body;

  try {
    const result1 = await Profiles.create({ movieId });
    const result2 = await Users.create({ profileName });
    console.log("보고싶어요result1:", result1);
    console.log("보고싶어요result2:", result2);

    res.status(200).json({
      ok: true,
      message: "보고싶어요 등록 성공",
    });
    console.log(`보고싶어요1결과: ${result1}`);
    console.log(`보고싶어요2결과: ${result2}`);
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "보고싶어요 등록 실패",
    });
    console.log(`${err}에러로 보고싶어요 등록 실패`);
  }
});



//평가 누르기
//1. req.body로 movieId, rate,  profileName
//2.            컨텐츠   컨텐츠  프로필 디비에서 찾기
//디비에 저장
// profileName이 저장되어야 하는곳은??
// Content디비에 저장하기
//res.json바디로 보내기 ok, 사인

//post      /content/detail/movieId/star
router.post("/content/detail/movieId/star", async (req, res) => {
  //
  const { movieId, profileName } = req.body;

  try {
    const result = await Content.create({ movieId, starRate: rate });
    const result2 = await Profile.create({ profileName });
console.log(`평가결과1: ${result}`);
console.log(`평가결과1: ${result2}`);

    res.status(200).json({
      ok: true,
      message: "평가 성공",
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "평가 실패",
    });
    console.log(`${err}에러로 평가실패`);
  }
});

//다본 작품
//post

module.exports = router;
