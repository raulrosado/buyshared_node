const UserModel = require('../Models/User.model')
const hashPasswordFunction = require('../bin/hashPassword');

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
        return UserModel.findById(idUser).exec();
    }

    async findByEmail(email){
        const query = UserModel.findOne({ 'email': email });
        const infoUser = await query.exec();
        return infoUser;
    }
}

module.exports = UserService;