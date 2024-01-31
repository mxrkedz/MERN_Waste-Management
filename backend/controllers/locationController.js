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
//Working
exports.getLocation = async (req, res, next) => {
  const locations = await Location.find();
  res.status(200).json({
    success: true,
    locations,
  });
};
//Not Working
exports.updateLocation = async (req, res, next) => {
  try {
    let location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
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
      for (let i = 0; i < location.images.length; i++) {
        try {
          const result = await cloudinary.v2.uploader.destroy(
            location.images[i].public_id
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
          folder: "Waste/locations",
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
    location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not updated",
      });
    }

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.error(`Error updating location: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error updating location: ${error.message}` });
  }
};
//Working
exports.deleteLocation = async (req, res, next) => {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);
  
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "Location not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Location deleted",
      });
    } catch (error) {
      console.error(`Error deleting location: ${error.message}`);
      res.status(500).json({ error: `Error deleting location: ${error.message}` });
    }
  };
