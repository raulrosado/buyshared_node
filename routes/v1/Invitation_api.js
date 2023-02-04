var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var router = express.Router();

const SolicitudService = require('../../services/solicitud.service');
const service = new SolicitudService();
const { config } = require('../../bin/config');

router.get("/",passport.authenticate("jwt", { session: false }), async (req, res) => {
  // console.log(req.user.sub);
  const list = await service.find();
  res.json(list);
});

router.post(
  "/sendEmail",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.body);
    const listParams = {
      id_user: req.user.sub,
      id_event: req.body.event,
      token: req.body.token,
      estado: 1
    };
    const list = await service.addSolicitud(listParams).then;
    res.json(list);
  }
);

module.exports = router;