const Video = require("../models/Video");
const User = require("../models/User");

async function getFavoriteVideo(req ,res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("favoriteVideos");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.favoriteVideos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
async function addVideoToFavorite(req ,res) {
  try {
    const { userId, videoId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteVideos.push(videoId);
    await user.save();
    res.status(200).json({ message: "Video added to favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
async function deleteVideoFromFavorite(req ,res) {
  try {
    const { userId, videoId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteVideos = user.favoriteVideos.filter(
      (item) => item.toString() !== videoId
    );
    await user.save();
    res
      .status(200)
      .json({ message: "Video removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  addVideoToFavorite,
  getFavoriteVideo,
  deleteVideoFromFavorite,
};
