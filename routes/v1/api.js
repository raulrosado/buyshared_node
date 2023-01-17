var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://raulrosado91:N0t3lav0yad3c1r@buyshare.t3ffzxr.mongodb.net/test', 
    {
    connectTimeoutMS: 1000,
    useNewUrlParser:true,
    useUnifiedTopology:true
    // Note that mongoose will **not** pull `bufferCommands` from the query string
    }
)
.then(
    console.log('bien')
)
.catch( e => console.log(e));

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

module.exports = router;