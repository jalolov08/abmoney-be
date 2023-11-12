const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const authController = require("./controllers/authController");
const postController = require("./controllers/postController");
const videoController = require("./controllers/videoController");
const audioController = require("./controllers/audioController");
const favoriteVideo = require("./controllers/favoriteVideo");
const favoriteAudio = require("./controllers/favoriteAudio");
const paymentController = require("./controllers/paymentController");
const storage = (folderName, allowedMimeTypes) =>
  multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (_, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"));
      }
      const uniqueFileName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });

const upload = (folderName, allowedMimeTypes) =>
  multer({
    storage: storage(folderName, allowedMimeTypes),
    fileFilter: (_, file, cb) => {
      const allowed = allowedMimeTypes.some((type) => type === file.mimetype);
      if (allowed) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  });

const profileUpload = upload("profilePhotos", ["image/jpeg", "image/png"]);
const postUpload = upload("postPhotos", ["image/jpeg", "image/png"]);
const videoUpload = upload("videos", ["video/mp4"]);
const audioUpload = upload("audios", ["audio/mpeg"]);
const thumbnailUpload = upload("thumbnails", ["image/jpeg", "image/png"]);

router.post(
  "/v1/upload/thumbnail",
  thumbnailUpload.single("image"),
  (req, res) => {
    res.json({
      url: `/v1/uploads/thumbnails/${req.file.filename}`,
    });
  }
);

router.post("/v1/upload/audio", audioUpload.single("audio"), (req, res) => {
  if (req.file.mimetype !== "audio/mpeg") {
    return res.status(400).json({ error: "Invalid file type" });
  }
  res.json({
    url: `/v1/uploads/audios/${req.file.filename}`,
  });
});

router.post("/v1/upload/video", videoUpload.single("video"), (req, res) => {
  if (req.file.mimetype !== "video/mp4") {
    return res.status(400).json({ error: "Invalid file type" });
  }
  res.json({
    url: `/v1/uploads/videos/${req.file.filename}`,
  });
});

router.post(
  "/v1/upload/profilePhoto",
  profileUpload.single("image"),
  (req, res) => {
    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }
    res.json({
      url: `/v1/uploads/profilePhotos/${req.file.filename}`,
    });
  }
);

router.post("/v1/upload/postPhoto", postUpload.single("image"), (req, res) => {
  if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid file type" });
  }
  res.json({
    url: `/v1/uploads/postPhotos/${req.file.filename}`,
  });
});

router.post("/v1/auth/userInfo/:userId", authController.updateUserInformation);
router.post("/v1/auth/register", authController.registerUser);
router.post("/v1/auth/login", authController.loginUser);
router.get("/v1/users", authController.getUsers);
router.get("/v1/posts", postController.getPosts);
router.post("/v1/post", postController.addPost);
router.get("/v1/post/:postId", postController.getPostById);
router.put("/v1/post/:postId", postController.editPostById);
router.delete("/v1/post/:postId", postController.deletePostById);
router.get("/v1/videos", videoController.getVideos);
router.post("/v1/video", videoController.addVideo);
router.get("/v1/video/:videoId", videoController.getVideoById);
router.put("/v1/video/:videoId", videoController.editVideoById);
router.delete("/v1/video/:videoId", videoController.deleteById);
router.get("/v1/audios", audioController.getAudios);
router.post("/v1/audio", audioController.addAudio);
router.put("/v1/audio/:id", audioController.editAudio);
router.delete("/v1/audio/:id", audioController.deleteAudio);
router.post("/v1/user/favorite/video", favoriteVideo.addVideoToFavorite);
router.post("/v1/user/favorite/audio", favoriteAudio.addAudioToFavorite);
router.get("/v1/user/favorite/videos/:userId", favoriteVideo.getFavoriteVideo);
router.get("/v1/user/favorite/audios/:userId", favoriteAudio.getFavoriteAudio);
router.delete("/v1/user/favorite/video", favoriteVideo.deleteVideoFromFavorite);
router.delete("/v1/user/favorite/audio", favoriteAudio.deleteAudioFromFavorite);
router.post("/v1/buypro", paymentController.createPayment);

module.exports = router;
