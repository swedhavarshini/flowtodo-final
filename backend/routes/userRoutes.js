const express = require("express");
const router = express.Router();
const { saveRoutine } = require("../controllers/userController");

router.post("/routine", saveRoutine);

module.exports = router;