const express = require("express");
const router = express.Router();
const {
  createBuild,
  getBuilds,
  getBuildById,
} = require("../Controller/buildController");
router.post("/createbuild", createBuild);
router.get("/getallbuild/:id", getBuilds);
router.get("/getbuild/:id", getBuildById);

module.exports = router;
    