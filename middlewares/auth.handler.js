const boom = require('boom');
const {config} = require('../bin/config.js')

function checkApiKey(req,res,next){
    const apiKey = req.headers['api'];
    if(apiKey === config.apiKey){
        next();
    }else{
        next(boom.unauthorized());
    }
}

module.exports = {checkApiKey}
