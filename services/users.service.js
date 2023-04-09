const UserModel = require('../Models/User.model')
const hashPasswordFunction = require('../bin/hashPassword');
const fs = require('fs').promises

class UserService {
    constructor() {}
    
    async AddUser(user){
        const hash = await hashPasswordFunction.hashPassword(user.password);
        const newUser = {
            ...user,
            password:hash
        }
        const newUserCreate = new UserModel(newUser)
        return await newUserCreate.save()
    }

    async find(){
        return UserModel.find().exec();
    }

    async findOne(idUser){
        const infoUser = await UserModel.findOne({ '_id': idUser }).exec();
        return infoUser;
    }

    async findByEmail(email){
        const query = UserModel.findOne({ 'email': email });
        const infoUser = await query.exec();
        return infoUser;
    }

    async findAvatarById(idUser){
        return UserModel.findOne({ '_id': idUser },{avatar:1}).exec();
    }

    async changeAvatar(parametro){
        const infoUser = await this.findAvatarById(parametro.id)
        let avatar = infoUser.avatar
        if(avatar === "avatar.png"){
            UserModel.updateOne({'_id': {$eq: parametro.id}},
                {
                  $set: { "avatar": parametro.avatar }
                }) .exec();
             return {success:true}
        }else{
            fs.unlink(`./public/images/${infoUser.avatar}`)
            .then(() => {
                console.log('File removed')
                UserModel.updateOne({'_id': {$eq: parametro.id}},
                {
                  $set: { "avatar": parametro.avatar }
                }).exec();
                let res = {
                 success:true,
                 filename:parametro.avatar 
                }
                return res

            }).catch(err => {
                console.error('Something wrong happened removing the file', err)
                return {success:false}
            })
        }
    }

    async changeInfoPersonal(parametro){
        UserModel.updateOne({'_id': {$eq: parametro.id}},
        {
          $set: { 
            "name": parametro.name,
            "apellidos": parametro.apellidos,
            "email": parametro.email, }
        }) .exec();
        return {success:true}
    }

    async changePassword(parametro){
        UserModel.updateOne({'_id': {$eq: parametro.id}},
        {
          $set: { 
            "password": await hashPasswordFunction.hashPassword(parametro.password),
            }
        }).exec();
        return {success:true}
    }

}

module.exports = UserService;