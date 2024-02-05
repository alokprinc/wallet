const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { Account } = require("../models/bankModel");

const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const session = await mongoose.startSession();
  const fromAccount = await Account.findOne({ userId: fromAccountId });
  const toAccount = await Account.findOne({ userId: toAccountId });

  console.log(fromAccountId, toAccountId);
  console.log(fromAccount, toAccount, amount);

  session.startTransaction();
  try {
    await Account.findByIdAndUpdate(fromAccount._id, {
      $inc: { balance: -amount },
    });
    await Account.findByIdAndUpdate(toAccount._id, {
      $inc: { balance: amount },
    });

    await session.commitTransaction();
    await session.endSession();
    console.log("Transaction successfully completed");
    return true;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    console.log("Transaction failed", err);
    return false;
  }
};

module.exports = { transferFunds };
