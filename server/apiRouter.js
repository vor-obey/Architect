const express = require('express');
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;
