const express = require("express");
const { getTests } = require("../Controller/testController");
const router = express.Router();

router.get("/gettest/:id", getTests);

module.exports = router;
