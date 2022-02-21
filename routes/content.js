const { urlencoded } = require("express");
const express = require("express");
const { $where } = require("../schemas/contents");
const router = express.Router();
const Content = require("../schemas/contents");
const Profile = require("../schemas/profiles");
const User = require("../schemas/users");

router.post('content/list', async (req, res) => {
  const { profileName, listRelay, want } = req.body;

  const listTop = Content.find({},{_id : false, __v: false, movieId: true, card_image: true}).sort('-average_star').limit(10)
  let arrRelay = [] 
  for (let element of listRelay) {

    const movieInfo = Content.find({movieId: element.movieId}, {_id : false, __v: false, movieId: true, card_image: true})
    arrRelay.push(movieInfo)
  }



})

//프로필 선택시 프로필네임에 프로필디비모두담아 보냄
//1. req.body로 profileName, listRelay, want받기
//2. 프로필 디비와 비교
//3. res.json바디로 보내기
// 3-1 listTop - {movieId:imageUrl}
//  컨텐츠디비의 starRate에서 movieId, imageUrl뽑아서 키와밸류에 넣기
// 몽고디비 다큐먼트 불러오는 리밋 - db.collection.find().limit(Number)


// //메인 페이지(영상 리스트 부분)
// // post   /content/list
// router.post("/content/list", async (req, res) =>{
//             //프로필     이어보기    보고싶어요
//     const { profileName, listRelay, want } = req.body;
//     //listRelay는 profile스키마 [{movieId영화:멈춘지점}]
//     //want [movieId 보고싶어요영화목록]

//     // listRelay = listRelay.movieId
//     // want = want.movieId

//     // const existListRelay =  await Profiles.findOne({  });
//     // const existWant = await Profiles.findOne({  });

//     try {
//         // const existProfiles =  await Profiles.find({ listRelay: listRelay.movieId });
//         // const existWant = await Profiles.findOne({ want: want.movieId });
//         // const existcategory = await Content.findOne({ category });
//         const existlistTop = await Content.findOne({ starRate });

//         // listTop
//         //key, value 추출
//         const listTopKeys = Object.keys(existlistTop);
//         const listTopValues = Object.values(existlistTop);
// console.log("111 listTopKeys: ", listTopKeys);
// console.log("222 listTopValues: ", listTopValues);

//         //movidId에 key, imageUrl에 value 삽입 안됨!!!
//         // const listTop =  Object.assign(listTopKeys, listTopValues);
//         const listTop =  {listTopKeys, listTopValues};
//         console.log("12121,listTop:", listTop);

//         for (const list in listTop){
//             console.log(listTop.listTopKeys)
//         }

//         // const listTop = { listTop_movieId, listTop_imageUrl};

//         //

//         return res.status(200).json({
//             //탑텐 starRate - content디비에서
//             listTop,
//             //이어보기
//             // listRelay:{
//             //     movieID: existProfiles.listRelay.movieId,
//             //     imageUrl:urrrrl,
//             //     relay: existProfiles.
//             // },
//             // //보고싶어요
//             // listWant:{
//             //     movieID: existWant.want.movieId,
//             //     imageUrl:
//             // },
//             // //카테고리 - content디비에서
//             // category:{????
//             //     movieId: existContent.category
//             // },

//             ok: true,
//             message:"메인페이지 영상리스트 불러오기 성공!"
//         })

//     } catch (err) {
//         res.status(400).json({
//             ok: false,
//             errorMessage: "메인페이지 영상리스트 불러오기 실패!"
//         });
//     }

// // listR- movieId값뽑기 > 디비에서 찾기

// });



//영상 상세 페이지
// post    /content/detail/:movieId
router.post("/content/detail/:movieId", async (req,res) => {
    try{
        const content = await Content.findOne({movieId:req.params}).exec();
        
        res.status(200).json({
            content,
            ok:true,
            message:"영상 상세보기 성공"
        });
        console.log(`영상상세보기movieDetail: ${movieDetail}`);
    } catch (err) {
        res.status(400).json({
            ok:false,
            errorMessage: "영상 상세보기 실패"
        });
        console.log(`영상 상세보기에러: ${err}`);

    }
});


//보고싶어요:리스트get
// post    /content/want
router.post("/content/want", async (req, res) => {
    try{
        const { movieId } = req.body;
        const want = 
        
        
        await Profile.findOne({ movieId:want.movieId }).exec();
        res.status(200).json({
            want,
            ok:true,
            message: "보고싶어요 성공"
        });
        console.log(`보고싶어요 성공: ${}`);
    } catch (err) {
        res.status(400).json({
            ok:false,
            errorMessage: "보고싶어요 실패"
        });
        console.log(`보고싶어요 에러: ${err}`);
    }
});



//이어보기:리스트get
//post     /content/continue

//다 본 작품:리스트get
//post  /content/complete

//평가한 작품 선택
//post    /content/doneEvaluation

//플레이페이지
//get      /video/:movieId


//함께보기:진입
//post       /video/playwith
//함께보기:채팅입력
//post        /video/playwith/message

//함께보기:채팅받기




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
