const Post = require("../models/Post")



async function getPosts(req, res){
    const posts = await Post.find();
    res.status(200).json(posts);
}
async function addPost(req, res){
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
}

async function getPostById(req , res){
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
}

async function editPostById(req, res){
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
}
async function deletePostById(req, res){
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
}
module.exports = {
    addPost,
    getPostById,
    editPostById,
    deletePostById,
    getPosts
}