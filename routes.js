const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const videoController = require('./controllers/videoController');
const audioController = require('./controllers/audioController');
const favoriteVideo = require('./controllers/favoriteVideo');
const favoriteAudio = require('./controllers/favoriteAudio');
router.post('/v1/auth/register', authController.registerUser);
router.post('/v1/auth/login', authController.loginUser);
router.get('/v1/posts', postController.getPosts);
router.post('/v1/post', postController.addPost);
router.get('/v1/post/:postId', postController.getPostById);
router.put('/v1/post/:postId', postController.editPostById);
router.delete('/v1/post/:postId', postController.deletePostById);
router.get('/v1/videos', videoController.getVideos);
router.post('/v1/video', videoController.addVideo);
router.get('/v1/video/:videoId', videoController.getVideoById);
router.put('/v1/video/:videoId', videoController.editVideoById);
router.delete('/v1/video/:videoId', videoController.deleteById);
router.get('/v1/audios', audioController.getAudios);
router.post('/v1/audio', audioController.addAudio);
router.put('/v1/audio/:id', audioController.editAudio);
router.delete('/v1/audio/:id', audioController.deleteAudio);
router.post('/v1/user/favorite/video', favoriteVideo.addVideoToFavorite);
router.post('/v1/user/favorite/audio', favoriteAudio.addAudioToFavorite);
router.get('/v1/user/favorite/videos/:userId', favoriteVideo.getFavoriteVideo);
router.get('/v1/user/favorite/audios/:userId', favoriteAudio.getFavoriteAudio);
router.delete('/v1/user/favorite/video', favoriteVideo.deleteVideoFromFavorite);
router.delete('/v1/user/favorite/audio', favoriteAudio.deleteAudioFromFavorite);
module.exports = router;