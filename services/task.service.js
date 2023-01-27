const TaskModel = require('../Models/Task.model')

class TaskService {
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
        return TaskModel.find().exec();
    }

    async findByIdUser(idUser){
        const query = TaskModel.find({ 'id_user': idUser });
        const list = await query.exec();
        return list;
    }
    async findByIdList(idList){
        const query = TaskModel.find({ 'id_lista': idList });
        const list = await query.exec();
        return list;
    }
    async getCantByIdList(idList){
        const query = TaskModel.find({ 'id_lista': idList }).count();
        const count = await query.exec();
        return count;
    }
    async findByIdEvent(idEvent){
        const query = TaskModel.find({ 'id_evento': idEvent });
        const list = await query.exec();
        return list;
    }
    // async findByIdReference(id){
    //     const query = TaskModel.find({ 'referencia': idEvent });
    //     const list = await query.exec();
    //     return list;
    // }
}

module.exports = TaskService;