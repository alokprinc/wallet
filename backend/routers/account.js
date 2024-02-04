const express = require("express");
const router = express.Router();
const { Account } = require("../models/bankModel.js");
const { verifyToken } = require("../middleware/authentication.js");
const {mongoose } = require("mongoose");

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
router.post('/transfer',verifyToken, async (req,res)=>{
    const {toAccount,amount} = req.body;
    const fromAccount = req.userId;
    await transferFunds(fromAccount, toAccount, amount);

})
module.exports = router;
