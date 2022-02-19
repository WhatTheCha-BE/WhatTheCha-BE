const { urlencoded } = require("express");
const express = require("express"); 
const router = express.Router(); 
const Contents = require("../schemas/contents"); 
const Profiles = require("../schemas/profiles"); 


//프로필 선택시 프로필네임에 프로필디비모두담아 보냄

//메인 페이지(영상 리스트 부분) 
// post   /content/list
router.post("/content/list", async (req, res) =>{
            //프로필     이어보기    보고싶어요
    const { profileName, listRelay, want } = req.body;
    //listRelay는 profile스키마 [{movieId영화:멈춘지점}]
    //want [movieId 보고싶어요영화목록]


    // listRelay = listRelay.movieId 
    // want = want.movieId

    // const existListRelay =  await Profiles.findOne({  });
    // const existWant = await Profiles.findOne({  });
    
    
    try {
        // const existProfiles =  await Profiles.find({ listRelay: listRelay.movieId });
        // const existWant = await Profiles.findOne({ want: want.movieId });
        // const existcategory = await Contents.findOne({ category });
        const existlistTop = await Contents.findOne({ starRate });
        // 리스트탑,,,만들어서 append
        const listTopKeys = Object.keys(existlistTop); 
        const listTopValues = Object.values(existlistTop); 
console.log("111 listTopKeys: ", listTopKeys);
console.log("222 listTopValues: ", listTopValues);
        const listTop_movieId = listTopKeys;
        const listTop_imageUrl = listTopValues;
        const listTop = { listTop_movieId: listTop_imageUrl }; 

        function listTop(key, value){
            
        }





        return res.status(200).json({
            //탑텐 starRate - contents디비에서   
            // listTop:{ 
            //     movieID: existProfiles.want.movieId, 
            //     imageUrl: ??
            // },
            // //이어보기    
            // listRelay:{
            //     movieID: existProfiles.listRelay.movieId, 
            //     imageUrl:urrrrl,
            //     relay: existProfiles.
            // },
            // //보고싶어요 
            // listWant:{
            //     movieID: existWant.want.movieId,
            //     imageUrl: 
            // },   
            // //카테고리 - contents디비에서    
            // category:{????
            //     movieId: existContents.category
            // },

            
            ok: true,
            message:"메인페이지 영상리스트 불러오기 성공!"
        })

    } catch (err) {
        res.status(400).json({
            ok: false,
            errorMessage: "메인페이지 영상리스트 불러오기 실패!"
        });
    }






// listR- movieId값뽑기 > 디비에서 찾기




});


//영상 상세 페이지
// post    /content/detail/:movieId


//보고싶어요:리스트get
// post    /content/want


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
//post        /video/playwith


//함께보기:채팅받기



//보고싶어요 누르기
//바디로 받고, 디비에 저장하고, req로 보내기
//post       /content/detail/movieId/want
router.post("/content/detail/movieId/want", async (req, res) => {
    const { movieId, profileName } = req.body;
//profileName 프로필디비저장
//movieId 컨턴츠디비저장





});




//평가 누르기
//post      /content/detail/movieId/star


//다본 작품
//post       









module.exports = router;