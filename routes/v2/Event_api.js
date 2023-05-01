var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();
const multer = require('multer');
const fs = require("fs");

const EventService = require("../../services/v2/event.services");
const service = new EventService();
const { config } = require("../../bin/config");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

router.get(
  "/user/:id_user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const list = await service.findByIdUser(req.params.id_user);
    res.status(200).json(list);
  }
);

module.exports = router;