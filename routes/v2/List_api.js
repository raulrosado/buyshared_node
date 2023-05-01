var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();

const ListService = require("../../services/v2/list.service");
const service = new ListService();
const { config } = require("../../bin/config");

router.post(
  "/addList",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const listParams = {
      id_user: req.user.sub,
      id_event: req.body.event,
      nombre: req.body.nombre,
      estado: 1,
      referencia: "",
    };
    const list = await service.AddList(listParams)
    const infoList = await service.getDetailList(list._id)
    res.json(infoList);
  }
);

router.get(
  "/user/:id_user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const list = await service.findByIdUser(req.params.id_user);
    res.json(list);
  }
);

module.exports = router;
