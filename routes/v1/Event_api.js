var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();
const multer = require('multer');
const fs = require("fs");

const EventService = require("../../services/event.service");
const service = new EventService();
const { config } = require("../../bin/config");

// const upload = multer({
//   dest: 'public/images'
// })
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

router.get("/",passport.authenticate("jwt", { session: false }), async (req, res) => {
  // console.log(req.user.sub);
  const list = await service.find();
  res.json(list);
});

router.post(
  "/addEvent",
  passport.authenticate("jwt", { session: false }),
  upload.single('file'),
  async (req, res) => {
    console.log(req.user);
    console.log(req.file);
    console.log(req.body.name_list)
    if (req.file.length == 0) {
        responseb.error = true;
        responseb.mensaje = 'Ingrese una imagen';
        responseb.codigo = 400;
        res.status(400).send(responseb);
    } else {
        if (req.file.mimetype.indexOf('image') >= 0) {
            const listParams = {
                id_user: req.user.sub,
                nombre: req.body.name_list,
                bg: req.file.originalname,
                estado: 1,
                referencia: "",
              };
              const list = await service.AddEvent(listParams);
              res.json(list);
        } else {
            responseb.error = true;
            responseb.mensaje = 'Ingrese una imagen';
            responseb.codigo = 400;
            res.status(400).send(responseb);
        }
    }
  }
);

router.get(
  "/user/:id_user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.user);                                         
    const list = await service.findByIdUser(req.params.id_user);
    res.json(list);
  }
);

module.exports = router;
