var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var router = express.Router();
const hashToken = require('../../bin/hashPassword');

const SolicitudService = require('../../services/solicitud.service');
const service = new SolicitudService();
const { config } = require('../../bin/config');

router.get("/getInfo/:token",passport.authenticate("jwt", { session: false }), async (req, res) => {
  const info = await service.findByToken(req.params.token);
  res.json(info);
});

router.post(
  "/sendSolicitud",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const hash = await hashToken.hashPassword(req.user.sub);
    const listParams = {
      id_user: req.user.sub,
      id_evento: req.body.idEvent,
      id_lista: req.body.idList,
      email: req.body.email,
      token: hash.replace("/",""),
      estado: 1
    };
    const list = await service.addSolicitud(listParams);
    res.status(200).json(list);
  }
);

  // passport.authenticate("jwt", { session: false }),
router.post('/actionSolicitud',
  async (req, res) => {
    // const hash = await hashToken.hashPassword(req.user.sub);
    const listParams = {
      // id_user: req.user.sub,
      token: req.body.token,
      action: req.body.action
    };
    const list = await service.actionSolicitud(listParams);
    res.json(list);
  }
);

module.exports = router;
