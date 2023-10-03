const express = require("express");
const router = express.Router();
let articalData = require("../ArticalsData.json");
var fs = require("fs");
const fsPromises = require("fs").promises;

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
  const { title, introduction, blogData } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Please add blog title");
  } else if (!introduction) {
    res.status(400);
    throw new Error("Please add introduction");
  } else if (!blogData) {
    res.status(400);
    throw new Error("Please add your blog");
  } else {
    fsPromises.readFile("ArticalsData.json", "utf-8").then((data) => {
      let json = JSON.parse(data);
      json.push({
        BlogID: `test0${json.length + 1}`,
        title: `${title}`,
        introduction: `${introduction}`,
        blogData: `${blogData}`,
      });
      fsPromises
        .writeFile("ArticalsData.json", JSON.stringify(json))
        .then(() => {
          res.status(200).json({
            BlogID: `test0${json.length + 1 - 1}`,
            title: `${title}`,
            introduction: `${introduction}`,
            blogData: `${blogData}`,
          });
        })
        .catch((err) => {
          res.status(400);
          throw new Error("Append Failed: " + err);
        });
    });
  }
});

module.exports = router;
