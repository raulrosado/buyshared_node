var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();

const ListService = require("../../services/list.service");
const service = new ListService();
const { config } = require("../../bin/config");

router.get("/",passport.authenticate("jwt", { session: false }), async (req, res) => {
  // console.log(req.user.sub);
  const list = await service.find();
  res.json(list);
});

router.post(
  "/addList",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.body);
    const listParams = {
      id_user: req.user.sub,
      id_event: req.body.event,
      nombre: req.body.nombre,
      estado: 1,
      referencia: "",
    };
    const list = await service.AddList(listParams).then;
    res.json(list);
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

router.get(
  "/:idList",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {                                      
    const list = await service.getDetailList(req.params.idList);
    res.json(list);
  }
);

router.delete(
  "/delList/:id_list",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {                                        
      const list = await service.delList(req.params.id_list);
      res.json(list);
    }
  )

module.exports = router;
