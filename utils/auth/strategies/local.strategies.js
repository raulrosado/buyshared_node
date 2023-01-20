const {Strategy} = require('passport-local');
const verifyPasswordFunction = require('../../../bin/verifyPassword');
const boom = require('boom');
const UserModel = require('../../../Models/User.model')

const UserService = require('../../../services/users.service');
const service = new UserService();

const LocalStrategy = new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email,password,done)=>{
        try {
            const infoUser = await service.findByEmail(email);
            if(!infoUser){
                done(boom.unauthorized(),false);
            }
            const ifValid = await verifyPasswordFunction.verifyPassword(password,infoUser.password);
            delete infoUser.password
            if(!ifValid){
                done(boom.unauthorized(),false);  
            }
            done(null,infoUser);
        } catch (error) {
            done(error,false);
        }
});

module.exports = LocalStrategy;