const Post = require("../models/post");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Working; need changes pag frontend na
exports.newPost = async (req, res, next) => {
  let images = [];
  // console.log(req.body);
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  }
  if (req.files) {
    req.body.images = req.files;
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < req.body.images.length; i++) {
    //tanggalin yung req.body pag front end na
    let imageDataUri = req.body.images[i].path; //tanggalin yung .path pag front end na
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "Waste/posts",
        width: 150,
        crop: "scale",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.error(`Error uploading image to Cloudinary: ${error}`);
    }
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;
  

  const post = await Post.create(req.body);
  if (!post) {
    return res.status(400).json({
      success: false,
      message: "Post not created",
    });
  }

  res.status(201).json({
    success: true,
    post,
  });
};
//Working
exports.getPost = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    success: true,
    posts,
  });
};
//Not Working
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    // Deleting images associated with the event
    if (images !== undefined) {
      for (let i = 0; i < post.images.length; i++) {
        try {
          const result = await cloudinary.v2.uploader.destroy(
            post.images[i].public_id
          );
        } catch (error) {
          console.log(`Error deleting image from Cloudinary: ${error}`);
        }
      }
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "Waste/posts",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.log(`Error uploading image to Cloudinary: ${error}`);
        // Handle the error as needed
        // You can choose to send an error response or take other actions
        return res.status(500).json({
          success: false,
          error: `Error uploading image to Cloudinary: ${error.message}`,
        });
      }
    }
    req.body.images = imagesLinks;
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not updated",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(`Error updating post: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error updating post: ${error.message}` });
  }
};
//Working
exports.deletePost = async (req, res, next) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Post deleted",
      });
    } catch (error) {
      console.error(`Error deleting post: ${error.message}`);
      res.status(500).json({ error: `Error deleting post: ${error.message}` });
    }
  };
