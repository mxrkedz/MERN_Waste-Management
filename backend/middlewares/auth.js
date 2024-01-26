exports.checkEmail = async (req, res, next) => {
    try {
      const { email } = req.query;
      const existingUser = await User.findOne({ email });
  
      res.status(200).json({
        exists: !!existingUser,
      });
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };
  
  exports.google = async (req, res, next) => {
    try {
      const { email, name, avatar } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
  
      let avatarData;
  
      if (avatar) {
        // Upload avatar to Cloudinary
        await cloudinary.v2.uploader.upload(
          avatar,
          {
            folder: "Waste/avatars",
            width: 150,
            crop: "scale",
          },
          (err, result) => {
            if (err) {
              console.error("Error uploading avatar to Cloudinary:", err);
              throw err;
            }
            avatarData = {
              public_id: result.public_id,
              url: result.secure_url,
            };
          }
        );
      }
  
      if (existingUser) {
        // User exists, log in the user
        // You may generate a token or create a session here
        sendToken(existingUser, 200, res);
      } else {
        // User doesn't exist, create a new user
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          avatar: avatarData,
        });
  
        await newUser.save();
  
        // Log in the new user
        sendToken(newUser, 201, res);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.facebook = async (req, res, next) => {
    try {
      const { email, name, avatar } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
  
      let avatarData;
  
      if (avatar) {
        // Upload avatar to Cloudinary
        await cloudinary.v2.uploader.upload(
          avatar,
          {
            folder: "profiles",
            width: 200,
            crop: "scale",
          },
          (err, result) => {
            if (err) {
              console.error("Error uploading avatar to Cloudinary:", err);
              throw err;
            }
            avatarData = {
              public_id: result.public_id,
              url: result.url,
            };
          }
        );
      }
  
      if (existingUser) {
        // User exists, log in the user
        // You may generate a token or create a session here
        sendToken(existingUser, 200, res);
      } else {
        // User doesn't exist, create a new user
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          avatar: avatarData,
        });
  
        await newUser.save();
  
        // Log in the new user
        sendToken(newUser, 201, res);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };