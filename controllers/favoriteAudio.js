const Audio = require("../models/Audio");
const User = require("../models/User");

async function addAudioToFavorite(req, res) {
  try {
    const { userId, audioId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteAudios.push(audioId);
    await user.save();
    res.status(200).json({ message: "Audio added to favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getFavoriteAudio(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("favoriteAudios");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.favoriteAudios);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
async function deleteAudioFromFavorite(req, res) {
  try {
    const { userId, audioId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteAudios = user.favoriteAudios.filter(
      (item) => item.toString() !== audioId
    );
    await user.save();
    res
      .status(200)
      .json({ message: "Audio removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  addAudioToFavorite,
  getFavoriteAudio,
  deleteAudioFromFavorite
};
