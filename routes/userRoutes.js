const express = require("express");
const router = express.Router();
var fs = require("fs");
const fsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");

router.post("/createUser", (req, res) => {
  const { userName, EmailId, Password, PhoneNo, City } = req.body;
  if (!userName) {
    res.status(200).json({ message: "Please Add User Name" });
  } else if (!EmailId) {
    res.status(200).json({ message: "Please Add Email" });
  } else if (!Password) {
    res.status(200).json({ message: "Please Add Password" });
  } else if (!PhoneNo) {
    res.status(200).json({ message: "Please Add Phone Number" });
  } else if (!City) {
    res.status(200).json({ message: "Please Add City" });
  } else {
    fsPromises.readFile("UsersData.json", "utf-8").then((data) => {
      let json = JSON.parse(data);
      json.push({
        UserID: `user0${json.length + 1}`,
        userName: `${userName}`,
        EmailId: `${EmailId}`,
        Password: `${Password}`,
        PhoneNo: `${PhoneNo}`,
        City: `${City}`,
      });
      fsPromises
        .writeFile("UsersData.json", JSON.stringify(json))
        .then(() => {
          res.status(200).json({
            UserID: `user0${json.length + 1 - 1}`,
            userName: `${userName}`,
            EmailId: `${EmailId}`,
            Password: `${Password}`,
            PhoneNo: `${PhoneNo}`,
            City: `${City}`,
            message: "Account Created Successfully",
          });
        })
        .catch((err) => {
          res.status(400);
          throw new Error("Append Failed: " + err);
        });
    });
  }
});

router.post("/loginUser", (req, res, next) => {
  const { EmailId, Password } = req.body;
  if (!EmailId) {
    res.status(200).json({ message: "Please Add Email" });
  } else if (!Password) {
    res.status(200).json({ message: "Please Add Password" });
  } else {
    fsPromises.readFile("UsersData.json", "utf-8").then((data) => {
      let json = JSON.parse(data);
      for (var i = 0; i < json.length; i++) {
        if (json[i].EmailId == EmailId && json[i].Password == Password) {
          try {
            res.status(200).json({
              user: {
                userID:json[i].UserID,
                Username: json[i].userName,
                Email: json[i].EmailId,
                token: generateToken(json[i].UserID),
              },
            });
            next(); 
          } catch (error) {
            res
              .status(200)
              .json({ message: "User Not Found Please Check Credentials" });
          }
        }
      }
    });
  }
});

//JWT Token Creation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = router;
