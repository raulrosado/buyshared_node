const ListModel = require('../Models/List.model')
const TaskService = require('./task.service');
const taskService = new TaskService();

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
        const query = ListModel.find({ 'id_user': idUser });
        let lists = await query.exec();
        let newLists = [];
        for (const [index, element] of lists.entries()) {
            const cant = await taskService.getCantByIdList(element.id);
            const course = {...element._doc,'cant':cant};
            newLists.push(course);
        }
        return newLists;
    }
}

module.exports = ListService;