const Audio = require("../models/Audio");

async function getAudios(req, res) {
  try {
    const audios = await Audio.find();
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addAudio(req, res) {
  try {
    const { title, audioUri } = req.body;
    const newAudio = new Audio({
      title,
      audioUri,
    });
    const savedAudio = await newAudio.save();
    const createdAudio = { ...savedAudio._doc };
    res.status(201).json(createdAudio);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function editAudio(req, res) {
  try {
    const { id } = req.params;
    const { title, audioUri } = req.body;
    const updatedAudio = await Audio.findByIdAndUpdate(
      id,
      { title, audioUri },
      { new: true }
    );
    if (!updatedAudio) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.status(200).json(updatedAudio);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteAudio(req, res) {
  try {
    const { id } = req.params;
    const deletedAudio = await Audio.findByIdAndDelete(id);
    if (!deletedAudio) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.status(200).json({ message: "Audio deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAudios,
  addAudio,
  editAudio,
  deleteAudio,
};
