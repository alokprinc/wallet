const mongoose = require("mongoose");
const { Account } = require("../models/bankModel");

const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const session = await mongoose.startSession();
  const fromAccount = await Account.findOne({ userId: fromAccountId });
  const toAccount = await Account.findOne({ userId: toAccountId });
    if(fromAccount.balance < amount){
        await session.endSession();
        return "Insufficient funds";
    }
  session.startTransaction();
  try {
    await Account.findByIdAndUpdate(fromAccount._id, {
      $inc: { balance: -amount },
    }).session(session);
    await Account.findByIdAndUpdate(toAccount._id, {
      $inc: { balance: amount },
    }).session(session);

    await session.commitTransaction();
    await session.endSession();
    console.log("Transaction successfully completed");
    return "Success";
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    console.log("Transaction failed", err);
    return "failure";
  }
};

module.exports = { transferFunds };
