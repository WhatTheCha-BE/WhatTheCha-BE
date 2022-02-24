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
    const { profileName } = req.body;

    const listTop = await Content.find({},{_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true}).sort('-average_star').limit(10);
    const profileInfo = await Profile.findOne({profileName}, {_id: false, want: true, listRelay: true})

    let relayList = [];
    for (let element of profileInfo.listRelay) {
          const movieInfo = await Content.findOne({movieId: element.movieId}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});
          relayList.push(movieInfo);
      };
  
    let wantList = [];
    for (let element of profileInfo.want) {
    const movieInfomation = await Content.findOne({movieId: element}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});
      wantList.push(movieInfomation);
    };

    const exclusiveList = await ExclusiveContent.find({})
    const titleList = await TitleContent.find({})
    const watchaPartyList = await WatchaParty.find({})

    const dramaList = await Content.find({$or:[ { category: "드라마" }, { category: "단편" } ]}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});
    const action_war_List = await Content.find({$or:[ { category: "액션" }, { category: "전쟁" } ]}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});
    const comedy_adventure__biography_List = await Content.find({$or:[ { category: "코미디" }, { category: "모험" }, { category: "전기" } ]}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});
    const fantasy_crime_romanse_etc_list = await Content.find({$or:[ { category: "판타지" }, { category: "범죄" },{ category: "로맨스" }, { category: "애니메이션" },{ category: "스릴러" }, { category: "SF" }, { category: "미스터리" } ]}, {_id : false, movieName : true, movieId: true, category: true, make_year: true, card_image: true});

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
router.post("/content/want", async (req, res) => {
  try{
    console.log(req.body);
      const { profileName } = req.body;
      
      //프로필디비에서 profileName기준으로 want를 찾는다.
      const existprofileName = await Profile.findOne({ profileName }, {_id:false, want:true});
      
      //want안에 movieId를 기준으로 card_image를 찾는다.
      const wantMovieId = existprofileName.want
      const want = await Content.find({ movieId:wantMovieId }, { _id:false, movieId:true, card_image:true });
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
  
  
//이어보기:리스트--작업중
router.post("/content/continue", async (req, res) => {
  try{
    const { profileName } = req.body;
    const existlistRelay = await Profile.findOne({ profileName }, { _id : false, listRelay:true });
    console.log("111existlistRelay.listRelay: ", existlistRelay.listRelay);


    //listRelay movieId를 기준으로 card_image를 찾는다. movieId처럼 Number로 왔을때가능한 로직
    //스트링으로 오면 다시짜기
    const listRelayMovieId = existlistRelay.listRelay
    const listRelay = await Content.find({ movieId:listRelayMovieId }, { _id:false, movieId:true, card_image:true });
    console.log("222listRelay@@", listRelay);  // [{movieId:30, card_image:~~},{movieId:31, card_image:~~}]

    res.status(200).json({
      listRelay,
      ok:true,
      message: "이어보기 리스트 성공"
    });
    console.log(`이어보기 리스트 성공: ${listRelay}`);
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
    const { profileName } = req.body;
    const existcomplete = await Profile.findOne({ profileName }, { _id : false, complete:true });

    //complete movieId를 기준으로 card_image를 찾는다. movieId처럼 Number로 왔을때가능한 로직
    //스트링으로 오면 다시짜기
    const completeMovieId = existcomplete.complete
    const complete = await Content.find({ movieId:completeMovieId }, { _id:false, movieId:true, card_image:true });
    console.log("222listRelay@@", complete);  // [{movieId:30, card_image:~~},{movieId:31, card_image:~~}]
  
    res.status(200).json({
      complete,
      ok:true,
      message: "다 본 작품 리스트 성공"
    });
    console.log(`다 본 리스트 성공: ${complete}`);
  } catch(err){
    res.status(400).json({
      ok:false,
      errorMessage: "다 본 작품 리스트 실패"
    });
    console.log(`다 본 작품 리스트 에러: ${err}`);
  }
});


//평가한 작품 리스트
router.post("/content/doneEvaluation", async (req, res) => {
  try{
    //프로필디비에서 profileName기준으로 doneEvaluation 찾는다.
    const { profileName } = req.body;
    const existdoneEvaluation = await Profile.findOne({ profileName }, { _id : false, doneEvaluation:true });
    
    //want안에 movieId를 기준으로 card_image를 찾는다.
    const doneEvalMovieId = existdoneEvaluation.doneEvaluation
    const doneEvaluation = await Content.find({ movieId:doneEvalMovieId }, { _id:false, movieId:true, card_image:true });

    res.status(200).json({
      doneEvaluation,
      ok:true,
      message: "평가한 작품 리스트 성공"
    });
    console.log(`평가한 작품 리스트 성공: ${doneEvaluation}`);
  } catch(err){
    res.status(400).json({
      ok:false,
      errorMessage: "평가한 작품 리스트 실패"
    });
    console.log(`평가한 작품 리스트 에러: ${err}`);
  }
});



// //보고싶어요 누르기 
// movieId가 있을때, 없을때를 구별해서 반복문돌리기
router.post("/content/detail/movieId/want", async (req, res) => {
  try {
    const { movieId, profileName } = req.body;
    console.log("11누르기req.body", req.body)  
    
    const myprofileName = await Profile.findOne({ profileName:profileName }, { _id: false });
    console.log("22myprofileName:", myprofileName)
    const wantMovieId = myprofileName.want
    console.log("22wantMovieId:", wantMovieId)

    let check = -1;
    for (let i=0; i<wantMovieId.length; i++) {
      if ( wantMovieId[i] === movieId ){
          check = 1;
        } 
    }
    console.log(123123, check);
    if (check === 1){
      await Profile.updateOne({ profileName:profileName }, {$pull: {want:movieId}});
      res.status(200).json({
        ok: true,
        message: "보고싶어요 취소 성공",
      });
    } else if(check === -1) {
      await Profile.updateOne({ profileName:profileName }, {$push: {want:movieId}});
      res.status(200).json({
        ok: true,
        message: "보고싶어요 누르기 성공",
      });
    }
     
  } catch (err) {
    res.status(500).json({
      ok: false,
      errorMessage: "보고싶어요 누르기 예상치 못한 에러 발생했습니다.",
    });
    console.log(`보고싶어요 누르기 에러": ${err}`);
  }
});


//평가 누르기
router.post("/content/detail/movieId/star", async (req, res) => { 
  try { 
    const { movieId, profileName } = req.body; 
    console.log("11누르기req.body", req.body)  

    //profileName을 기준으로 doneEvaluation을 찾는다.
    const myprofileName = await Profile.findOne({ profileName:profileName }, { _id: false });
    const EvaluMovieId = myprofileName.doneEvaluation
    console.log("22myprofileName:", myprofileName)
    console.log("22wantMovieId:", EvaluMovieId)

    let check = -1;
    for (let i = 0; i < EvaluMovieId.length; i++) {
    if ( EvaluMovieId[i] === movieId ){
        check = 1;
      } 
    }
    console.log("123 check값은?", check);
    if (check === 1){
      await Profile.updateOne({ profileName:profileName }, {$pull: {doneEvaluation:movieId}});
      res.status(200).json({
        ok: true,
        message: "평가 취소 성공",
      });
    } else if(check === -1) {
      await Profile.updateOne({ profileName:profileName }, {$push: {doneEvaluation:movieId}});
      res.status(200).json({
        ok: true,
        message: "평가 누르기 성공",
      });
    }

  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "평가 누르기 예상치 못한 에러 발생했습니다.",
    });
    console.log(`평가 누르기 에러: ${err}`);
  }
});

module.exports = router;