const express = require("express");
const userRoutes = require("./userRoute.js");
const account = require("./account.js");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/account", account);

module.exports = router;
