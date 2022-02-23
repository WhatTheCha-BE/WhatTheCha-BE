const express = require("express");
const router = express.Router();
const Playwith = require('../schemas/playwith')
const Contents = require('../schemas/contents')

// 플레이 페이지 (영화 정보 전송)
router.get('/video/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const selectMovie = await Contents.findOne( { movieId }, { _id : false, __v: false, youtubeId: true } );
        res.status(200).json({ selectMovie });
    } catch(error) {
        res.status(400).json({ ok : false });
    }
})

// 함께보기 페이지 진입 (기존 채팅 전송)
router.post('/video/playwith', async (req, res) => {
    try {
        const { movieId } = req.body;
        const existChatting = await Playwith.find({ movieId });
        res.status(200).json({ existChatting });
    } catch(error) {
        res.status(400).json({ ok : false })
    }
});

// 채팅 작성
router.post('/video/playwith/message', async (req, res) => {
    try {
        const { profileName, movieId, text } = req.body;
        const date = new Date(+new Date() + 3240 * 10000).toISOString().replace('T', ' ').replace(/\..*/, '');
        await Playwith.create({
            movieId,
            profileName,
            date,
            text
        });
        res.status(200).json({ ok : 'true'});
        } catch(error) {
            res.status(400).json({ ok : 'false' });
        }
    });




module.exports = router;
