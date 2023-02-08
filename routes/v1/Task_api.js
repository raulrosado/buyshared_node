var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var router = express.Router();

const TaskService = require('../../services/task.service');
const service = new TaskService();
const { config } = require('../../bin/config');


router.get('/', async (req,res)=>{
  const list = await service.find();
  res.json(list);
});

router.get('/user/:id_user',
  passport.authenticate('jwt',{session:false}),
  async (req,res)=>{
  const list = await service.findByIdUser(req.params.id_user);
  res.json(list);
});

router.get('/list/:id_list',
  passport.authenticate('jwt',{session:false}),
  async (req,res)=>{
  const list = await service.findByIdList(req.params.id_list);
  res.json(list);
});

router.get('/event/:id_event',
  passport.authenticate('jwt',{session:false}),
  async (req,res)=>{
  const list = await service.findByIdEvent(req.params.id_event);
  res.json(list);
});

router.post(
  "/addTask",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const listParams = {
      id_user: req.user.sub,
      id_evento: req.body.idEvent,
      id_lista: req.body.idList,
      texto: req.body.task,
      estado: 1,
      referencia: "",
    };
    const list = await service.addTask(listParams);
    res.json(list);
  }
);

module.exports = router;