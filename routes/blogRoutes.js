const express = require("express");
const router = express.Router();
let articalData = require("../ArticalsData.json");
var fs = require("fs");

router.get("/getAllBlogs", (req, res) => {
  res.status(200).json({ message: "All Blogs" });
});

router.get("/singlepost", (req, res) => {
  fs.readFile("ArticalsData.json", "utf8", function (err, data) {
    res.status(200).json({ Artical: articalData });
  });
});

router.post("/createBlog", (req, res) => {
  const { ArticalData } = req.body;
  fs.writeFile(
    "ArticalsData.json",
    `{"${"Artical"}":${JSON.stringify(ArticalData)}}`,
    function (err) {
      if (err) throw err;
      res.status(200).json({ message: "Blogs Added" });
    }
  );
});

module.exports = router;
