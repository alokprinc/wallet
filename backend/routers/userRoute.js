const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel.js");
const { Account } = require("../models/bankModel.js");
const {
  sign_up_validator,
  sign_in_validator,
  update_validator,
} = require("../validators/index.js");
const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/authentication.js");

// sign_up
router.post("/signup", async (req, res) => {
  const userData = req.body;
  const { success } = sign_up_validator.safeParse(userData);

  if (!success) {
    res.status(411).json({ message: "Email already taken / Incorrect inputs" });
    return;
  } else {
    const user = await User.create({
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
    });
    // saving to DB
    await user.save();
    const account = await Account.create({
      userId: user._id,
      balance: Math.floor(Math.random() * 10000 + 1000),
    });
    account.save();
    // const userId = user._id;
    // const username = userData.username;
    // const token = jwt.sign({ userId, username }, JWT_SECRET);

    const token = user.generateToken();
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 10 * 60 * 1000, // 10 minutes
    };
    res.cookie("token", token, cookieOptions);
    res
      .status(200)
      .json({ message: "User created successfully", token: "jwt" });
  }
});

// sign_in
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const { success } = sign_in_validator.safeParse({ username, password });
  if (!success) {
    res.status(411).json({ message: "Incorrect inputs" });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch) {
    const token = jwt.sign({ _id: user._id, username }, JWT_SECRET, {
      expiresIn: 32 * 60 * 60,
    });
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 10 * 60 * 1000, // 10 minutes
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Signed Successfully", token: "jwt" });
  } else {
    res.status(404).json({ message: "Incorrect Password or Email" });
  }
});

//
router.put("/", verifyToken, async (req, res) => {
  const { password, firstName, lastName } = req.body;
  const { success } = update_validator.safeParse({
    password,
    firstName,
    lastName,
  });

  if (!success) {
    res.status(401).json({ message: "Invalid Inputs" });
  }
  const user = await User.findOne({ _id: req.userId });
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = password;
  await user.save();

  return res.status(200).json({ msg: "Successfully updated", user });
});
// Logout User
router.get("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// Get Users

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });
  // i: To match both lower case and upper case pattern in the string.
  // m: To include ^ and $ in the pattern in the match i.e. to specifically search for ^ and $ inside the string. Without this option, these anchors match at the beginning or end of the string.
  // x: To ignore all white space characters in the $regex pattern.
  // s: To allow the dot character “.” to match all characters including newline characters.
  res.status(200).json({
    user: users.map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
    }),
  });
});
module.exports = router;
