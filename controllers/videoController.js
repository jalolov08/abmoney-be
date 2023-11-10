const Video = require("../models/Video");


async function getVideos(req, res) {
  try {
    const videos = await Video.find();

    
    const freeVideos = videos.filter(video => video.free === true);
    const paidVideos = videos.filter(video => video.free === false);

   
    res.status(200).json({ freeVideos, paidVideos });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addVideo(req ,res){
    try {
        const { title, videoUri , enTitle , free ,thumbnail } = req.body;
        const newVideo = new Video({
          title,
          videoUri,
          enTitle,
          free,
          thumbnail
        });
        const savedVideo = await newVideo.save();
        const createdVideo = { ...savedVideo._doc };
        res.status(201).json(createdVideo);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
}
async function getVideoById(req ,res){
    try {
        const videoId = req.params.videoId;
        const video = await Video.findById(videoId);
        if (!video) {
          return res.status(404).json({ error: "Video not found" });
        }
        video.views = video.views + 1;
        await video.save();
        res.status(200).json(video);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
}


async function editVideoById(req ,res){
    try {
        const videoId = req.params.videoId;
        const { title, videoUri } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
          videoId,
          { title, videoUri },
          { new: true }
        );
        if (!updatedVideo) {
          return res.status(404).json({ error: "Video not found" });
        }
        res.status(200).json(updatedVideo);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
}
async function deleteById(req , res ){
    try {
        const videoId = req.params.videoId;
        const deletedVideo = await Video.findByIdAndDelete(videoId);
        if (!deletedVideo) {
          return res.status(404).json({ error: "Video not found" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
}
module.exports = {
    getVideos,
    addVideo,
    getVideoById,
    editVideoById,
    deleteById
}