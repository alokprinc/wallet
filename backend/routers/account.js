const express = require("express");
const router = express.Router();
const { Account } = require("../models/bankModel.js");
const { User } = require("../models/userModel.js");
const { verifyToken } = require("../middleware/authentication.js");
const { transferFunds } = require("../transactions/index.js");

// Get Balance
router.get("/", verifyToken, async (req, res) => {
  const user = req.userId;
  try {
    const account = await Account.findOne({ userId: user });
    res.status(200).json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction
router.post("/transfer", verifyToken, async (req, res) => {
  const { toAccountUserName, amount } = req.body;
  const fromUserId = req.userId;

  const toUser = await User.findOne({ username: toAccountUserName });
  const toUserId = toUser._id.toString();
  const success = await transferFunds(fromUserId, toUserId, amount);
  if (success) {
    return res.status(200).json({ message: "Successfully transferred" });
  } else {
    return res.status(404).json({ message: "Failed to transfer" });
  }
});
module.exports = router;
