var express = require('express');
var router = express.Router();
var Mongodb = require('../../bin/mongodb');
const { checkApiKey } = require("../../middlewares/auth.handler");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:true,online:"true"});
});

router.post('/login', async (req,res) =>{
    const UserModel = require('../../Models/User.model')
    const verifyPasswordFunction = require('../../bin/verifyPassword');

    const query = UserModel.findOne({ 'email': req.body.email });
    const infoUser = await query.exec();
    const ifValid = await verifyPasswordFunction.verifyPassword(req.body.password,infoUser.password);
    if(ifValid){
        res.json({status:true,online:"true"});    
    }else{
        res.json({status:false});
    }
});

router.post('/add_user', async (req,res) =>{
    const UserModel = require('../../Models/User.model')
    const hashPasswordFunction = require('../../bin/hashPassword');

    const nombre = req.body.firstName.split(' ');
    const hash = await hashPasswordFunction.hashPassword(req.body.password);
    console.log("fuera:"+hash)

    var infoUser = { 
        name : nombre[0],
        apellidos : nombre[1] + ' ' +nombre[2],
        email : req.body.email,
        password : hash,
        avatar : "",
        token : "",
        estado : 1
    };
    const newUser = new UserModel(infoUser)
    await newUser.save()

    res.json({
        status:true,
        user:infoUser
    })
});

router.get('/user',checkApiKey, (req,res)=>{
    const UserModel = require('../../Models/User.model')
    UserModel
    .find()
    .then(allUsers => res.json(allUsers))
});

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