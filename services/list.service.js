const ListModel = require('../Models/List.model')
const TaskService = require('./task.service');
const UserService = require('./users.service');
const taskService = new TaskService();
const userService = new UserService();

class ListService {
    constructor() {}
    async AddList(list){
        const newListCreate = new ListModel(list)
        return await newListCreate.save()
    }

    async find(){
        return ListModel.find().exec();
    }

    async findByIdUser(idUser){
        const query = ListModel.find({ 'id_user': idUser });
        let lists = await query.exec();
        let newLists = [];  
        let newListsAvatar = [];
        for (const [index, element] of lists.entries()) {
            //cantidad de tareas en la lista
            const cant = await taskService.getCantByIdList(element.id);
            const course = {...element._doc,'cant':cant};
            newLists.push(course);
            //buscar los avatares de los usuarios de la lista
            let listaId = [];
            const avatar = await userService.findAvatarById(element.id_user);
            listaId.push(avatar);

            const listaUsuariosByIdList = await ListModel.find({'referencia':element.id}).exec();
            for (const [index, usuario] of listaUsuariosByIdList.entries()) {
                const avatar = await userService.findAvatarById(usuario.id_user);
                listaId.push(avatar);
            }
            newListsAvatar.push(listaId);
        }
        newLists.push(newListsAvatar);
        return newLists;
    }

    async getDetailList(idList){
        const query = ListModel.findOne({ '_id': idList });
        let lists = await query.exec();
        let avatarList = [];
        const otros = await ListModel.find({'referencia':idList}).exec();
        for (const [index, user] of otros.entries()) {
            const avatar = await userService.findAvatarById(user.id_user);
            avatarList.push(avatar);
        }

        const tasks = await taskService.findByIdList(idList);
        const taskList = [];
        const respuesta = {
            ...lists._doc,
            avatarList,
            tasks
        }
        return respuesta;
    }

    async delList(idList){
        const tasks = taskService.deleteAllTasksByIdList(idList)
        await ListModel.deleteOne({ '_id': idList }).exec();
        return {
            'success':true
        }
    }

    // async delEvent(idEvent){
    //     const tasks = taskService.deleteAllTasksByIdEvent(idEvent)
    //     const event = EventModel.findOne({ '_id': idEvent});
    //     let eventInfo = await event.exec();
    //     fs.unlink(`./public/images/${eventInfo.bg}`)
    //     .then(() => {
    //         console.log('File removed')
    //     }).catch(err => {
    //         console.error('Something wrong happened removing the file', err)
    //     })
    //     const delEvent = await EventModel.deleteOne({ '_id': idEvent });
    //     delEvent.exec();
    //     return {
    //         'success':true
    //     }
    // }
}

module.exports = ListService;