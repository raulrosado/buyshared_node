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

    async delTask(idTask){
        await TaskModel.deleteOne({ '_id': idTask }).exec();
        return {
            'success':true
        }
    }

    async complet(idTask){
        const task = await TaskModel.findOne({ '_id': idTask },{estado:1}).exec();
        let newEstado = 0;
        if(task.estado === 1){
            newEstado = 2
        }else{
            newEstado = 1
        }

        await TaskModel.update(
            { '_id': idTask },
            {$set: { "estado" : newEstado}}).exec();
        return {
            'success':true,
            'estado':newEstado
        }
    }
}

module.exports = TaskService;