const TaskModel = require('../Models/Task.model')

class TaskService {
    constructor() {}
    async addTask(newTask){
        const newTaskCreate = new TaskModel(newTask)
        await newTaskCreate.save()
        const query = TaskModel.findOne({ 'id_user': newTask.id_user,'texto': newTask.texto });
        const list = await query.exec();
        return list;
    }

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
    async deleteAllTasksByIdEvent(idEvent){
        const query = TaskModel.deleteMany({ 'id_evento': idEvent });
        const list = await query.exec(); 
        let res ={
            "success":true
        }
        return res
    }
    async deleteAllTasksByIdList(idList){
        const query = TaskModel.deleteMany({ 'id_lista': idList });
        const list = await query.exec(); 
        let res ={
            "success":true
        }
        return res
    }
}

module.exports = TaskService;