var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var router = express.Router();
var Mongodb = require('../../bin/mongodb');
const { checkApiKey } = require("../../middlewares/auth.handler");

const UserService = require('../../services/users.service');
const service = new UserService();
const { config } = require('../../bin/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:true,online:"true"});
});

/* POST login   */
router.post('/login',
    passport.authenticate('local', {session: false}),
    async (req,res,next) =>{
        try {
            const user = req.user;
            const payload = {
              sub: user.id,
              role: user.role
            }
            console.log(config.jwtSecret);
            const token = jwt.sign(payload, config.jwtSecret);
            res.json({
                status:true,
                user,
                token
            });   
        } catch (error) {
            next(error);
        }
    }
);

router.post('/add_user', async (req,res) =>{
    const nombre = req.body.firstName.split(' ');
    var infoUser = { 
        name : nombre[0],
        apellidos : nombre[1] + ' ' +nombre[2],
        email : req.body.email,
        password : req.body.password,
        avatar : "",
        role :"costumer",
        token : "",
        estado : 1
    };
    service.AddUser(infoUser)
    delete infoUser.password
    res.json({
        status:true,
        user:infoUser
    })
});

router.get('/user',
    passport.authenticate('jwt',{session:false}),
    async (req,res)=>{
        const users = await service.find();
        console.log(users)
        res.json(users);
    }
);

router.get('/user/detail/:id',checkApiKey, async (req,res) => {
    const UserModel = require('../../Models/User.model')
    const idUser = req.params.id
    console.log(idUser)
    try {
        await UserModel
        .findById(idUser)
        .then(userInfo => res.json(userInfo))
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;