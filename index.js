const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Post = require("./models/Post");
const Video = require("./models/Video");
const Audio = require("./models/Audio");
const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:qEgxCDbmb4XMxPRX@cluster0.yxpf8lq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());
app.get("/v1/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/v1/auth/register", async (req, res) => {
  try {
    const { name, surname, email, age, gender, photoUri, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      email,
      age,
      gender,
      photoUri,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const responseUser = { ...savedUser._doc };
    res.status(201).json(responseUser);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        age: user.age,
        gender: user.gender,
        photoUri: user.photoUri,
      },
      "abmoneySecretKey123",
      { expiresIn: "1y" }
    );

    
    const responseUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      age: user.age,
      gender: user.gender,
      photoUri: user.photoUri,
    };

    res.status(200).json({ token, user: responseUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/v1/me", async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split("Bearer ")[1];
    const decoded = jwt.verify(token, "abmoneySecretKey123");

    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const responseUser = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      age: user.age,
      gender: user.gender,
      photoUri: user.photoUri,
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/v1/posts", async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});
app.post("/v1/post", async (req, res) => {
  try {
    const { title, description, photoUri, author } = req.body;
    const newPost = new Post({
      title,
      description,
      photoUri,
      author,
    });
    const savedPost = await newPost.save();
    const createdPost = { ...savedPost._doc };
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.get("/v1/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/v1/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, description, photoUri } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, photoUri },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/v1/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/v1/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/v1/video", async (req, res) => {
  try {
    const { title, videoUri } = req.body;
    const newVideo = new Video({
      title,
      videoUri,
    });
    const savedVideo = await newVideo.save();
    const createdVideo = { ...savedVideo._doc };
    res.status(201).json(createdVideo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/v1/video/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/v1/video/:videoId", async (req, res) => {
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
});
app.delete("/v1/video/:videoId", async (req, res) => {
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
});
app.get("/v1/audios", async (req, res) => {
  try {
    const audios = await Audio.find();
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/v1/audio", async (req, res) => {
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
});

app.post("/v1/user/favorite/video", async (req, res) => {
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
});


app.post("/v1/user/favorite/audio", async (req, res) => {
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
});

app.get("/v1/user/favorite/videos/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favoriteVideos');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.favoriteVideos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/v1/user/favorite/audios/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favoriteAudios');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.favoriteAudios);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/v1/user/favorite/video", async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteVideos = user.favoriteVideos.filter((item) => item.toString() !== videoId);
    await user.save();
    res.status(200).json({ message: "Video removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete("/v1/user/favorite/audio", async (req, res) => {
  try {
    const { userId, audioId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteAudios = user.favoriteAudios.filter((item) => item.toString() !== audioId);
    await user.save();
    res.status(200).json({ message: "Audio removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen("3333", () => {
  console.log("Server started at 3333 port");
});
