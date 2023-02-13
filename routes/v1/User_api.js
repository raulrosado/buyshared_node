var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require("fs");
var router = express.Router();

const UserService = require('../../services/users.service');
const service = new UserService();
const { config } = require('../../bin/config');
var Mongodb = require('../../bin/mongodb');
const verifyPasswordFunction = require('../../bin/verifyPassword');

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
            const token = jwt.sign(payload, config.jwtSecret);
            res.status(200).send({
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
        avatar : "avatar.png",
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
        res.json(users);
    }
);

router.get('/user/detail/:id',
    passport.authenticate('jwt',{session:false}),
    async (req,res) => {
        try {
            const user = await service.findOne(req.params.id);
            delete user.password
            console.log(user);
            res.json(user);
        } catch (error) {
            console.log(error)
        }
    }
);

router.post('/postChangePictur',passport.authenticate('jwt',{session:false}),
    upload.single('file'),
    async (req, res) => {
    if (req.file.length == 0) {
        responseb.error = true;
        responseb.mensaje = 'Ingrese una imagen';
        responseb.codigo = 400;
        res.status(400).send(responseb);
    } else {
        if (req.file.mimetype.indexOf('image') >= 0) {
            const listParams = {
                id:req.user.sub,
                avatar: req.file.originalname
              };
              const list = await service.changeAvatar(listParams);
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

router.post('/postChangeInfo',
    passport.authenticate('jwt',{session:false}),
    async (req,res)=>{
        const nombre = req.body.name.split(' ');
        console.log(req.body)
        console.log(req.user.sub)
        var infoUser = {
            id:req.user.sub,
            name : nombre[0],
            apellidos : nombre[1] + ' ' +nombre[2],
            email : req.body.email,
        };
        const users = await service.changeInfoPersonal(infoUser);
        res.json(users);
    }
);
router.post('/postChangePassword',
    passport.authenticate('jwt',{session:false}),
    async (req,res)=>{
        const passwordAnt = req.body.passwordAnt;
        const passwordNew = req.body.passwordNew;
        const passwordRepetNew = req.body.passwordRepetNew;

        var infoUser = { 
            id:req.user.sub,
            password : passwordRepetNew,
        };
        
        const infoUserChangeP = await service.findOne(req.user.sub);
        const ifValid = await verifyPasswordFunction.verifyPassword(passwordAnt,infoUserChangeP.password);
        if(ifValid){
            if(passwordNew === passwordRepetNew){
                const users = await service.changePassword(infoUser);
                res.json(users);
            }else{
                let resp = {success:false}
                res.json(resp)
            }
        }else{
            let resp = {success:false}
            res.json(resp)
        }
    }
);

module.exports = router;