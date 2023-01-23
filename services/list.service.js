const ListModel = require('../Models/List.model')

class ListService {
    constructor() {}
    // async AddUser(user){
    //     const hash = await hashPasswordFunction.hashPassword(user.password);
    //     const newUser = {
    //         ...user,
    //         password:hash
    //     }
    //     const newUserCreate = new UserModel(newUser)
    //     return await newUserCreate.save()
    // }

    async find(){
        return ListModel.find().exec();
    }

    async findByIdUser(idUser){
        const query = ListModel.findOne({ 'id_user': idUser });
        const list = await query.exec();
        return list;
    }
}

module.exports = ListService;