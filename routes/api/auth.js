const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs").promises;
const User = require("../../models/user");
const auth = require("../../middleware/auth");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Signup route
router.post("/signup", async (req, res, next) => {
  try {
    // Validate request body
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details);
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Generate gravatar URL
    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  try {
    // Validate request body
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details);
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default_jwt_secret",
      {
        expiresIn: "1h",
      }
    );

    // Update user with token
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.get("/logout", auth, async (req, res, next) => {
  try {
    // Clear user's token
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Current user route
router.get("/current", auth, async (req, res, next) => {
  try {
    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
});

// Update avatar route
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Avatar file is required" });
      }

      const { path: tempUpload, filename } = req.file;
      const avatarFileName = `${req.user._id}_${filename}`;
      const avatarPath = path.join("public", "avatars", avatarFileName);

      try {
        // Process image with Jimp
        const image = await jimp.read(tempUpload);
        await image.resize(250, 250).writeAsync(avatarPath);

        // Update user's avatarURL
        const avatarURL = `/avatars/${avatarFileName}`;
        await User.findByIdAndUpdate(req.user._id, { avatarURL });

        res.json({ avatarURL });
      } finally {
        // Always try to remove the temp file
        try {
          await fs.unlink(tempUpload);
        } catch (unlinkError) {
          console.error("Error removing temp file:", unlinkError);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
