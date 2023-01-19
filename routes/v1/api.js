var express = require('express');
var router = express.Router();
var Mongodb = require('../../bin/mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:true,online:"true"});
});

router.post('/add_user',function(req,res){
    console.log(req)
    res.json({
        firstName:req.body.firstName
    })
});

router.get('/user',function(req,res){
    const UserModel = require('../../Models/User.model')
    UserModel
    .find()
    .then(allUsers => res.json(allUsers))
    // res
    // .status(200)
    // .json({
    //     status:true,
    //     user:{
    //         firstName:"Raul",
    //         email:"raulrosado91@gmail.com"
    //     }
    // });
});

module.exports = router;