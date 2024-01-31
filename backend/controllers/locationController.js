const Location = require("../models/location");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Working; need changes pag frontend na
exports.newLocation = async (req, res, next) => {
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
        folder: "Waste/locations",
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
  req.body.user = req.user.id;

  const location = await Location.create(req.body);
  if (!location) {
    return res.status(400).json({
      success: false,
      message: "Location not created",
    });
  }

  res.status(201).json({
    success: true,
    location,
  });
};

exports.getAdminLocations = async (req, res, next) => {
  try {
    const resPerPage = 1;
    const postsCount = await Location.countDocuments();
    const apiFeatures = new APIFeatures(Location.find(), req.query)
      .search()
      .filter()
      .category()
      .pagination(resPerPage);

    apiFeatures.pagination(resPerPage);
    const locations = await apiFeatures.query;
    const filteredPostsCount = locations.length;

    if (!locations) {
      return res.status(404).json({
        success: false,
        message: "Posts not found",
      });
    }

    res.status(200).json({
      success: true,
      filteredPostsCount,
      postsCount,
      locations,
      resPerPage,
    });
  } catch (error) {
    console.error(`Error fetching locations: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res.status(500).json({
      success: false,
      error: `Error fetching locations: ${error.message}`,
    });
  }
};
