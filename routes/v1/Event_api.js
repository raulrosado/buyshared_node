var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();

const EventService = require("../../services/event.service");
const service = new EventService();
const { config } = require("../../bin/config");

router.get("/",passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req.user.sub);
  const list = await service.find();
  res.json(list);
});

router.post(
  "/addEvent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.user);
    const listParams = {
      id_user: req.user.sub,
      nombre: req.params.nombre,
      bg: req.params.image,
      estado: 1,
      referencia: "",
    };
    const list = await service.AddEvent(listParams);
    res.json(list);
  }
);

router.get(
  "/user/:id_user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.user);                                         
    const list = await service.findByIdUser(req.params.id_user);
    res.json(list);
  }
);

module.exports = router;
