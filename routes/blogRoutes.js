const express = require("express");
const router = express.Router();
let articalData = require("../ArticalsData.json");
var fs = require("fs");

router.get("/getAllBlogs", (req, res) => {
  fs.readFile("ArticalsData.json", "utf8", function (err, data) {
    let json = JSON.parse(data);
    res.status(200).json({ json });
  });
});

router.get("/singlepost/:id", async (req, res) => {
  const blogId = req.params.id;
  fs.readFile("ArticalsData.json", "utf8", function (err, data) {
    let json = JSON.parse(data);
    let arrayLen = json.length;
    for (var i = 0; i < arrayLen; i++) {
      if (json[i].BlogID === blogId) {
        res.status(200).json({ blogdata: json[i] });
      }
    }
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
