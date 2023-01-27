const EventModel = require('../Models/Event.model')
const TaskService = require('./task.service');
const UserService = require('./users.service');
const taskService = new TaskService();
const userService = new UserService();

class EventService {
    constructor() {}
    async AddEvent(list){
        const newEventCreate = new EventModel(list)
        return await newEventCreate.save()
    }

    async find(){
        return EventModel.find().exec();
    }

    async findByIdUser(idUser){
        const query = EventModel.find({ 'id_user': idUser });
        let lists = await query.exec();
        let newLists = [];  
        let newListsAvatar = [];
        for (const [index, element] of lists.entries()) {
            let porC = 0;
            let taskComplet = 0;
            //cantidad de tareas en la lista
            // const cant = await taskService.getCantByIdList(element.id);
            const task = await taskService.findByIdEvent(element.id);
            
            for (const [index, element] of task.entries()) {
                if(element.estado == 2){
                    taskComplet++;
                }
            }
            porC = (taskComplet / task.length)*100;
            const course = {...element._doc,'cant':task.length,'complet':porC};
            newLists.push(course);

            //buscar los avatares de los usuarios de la lista
            let listaId = [];
            const avatar = await userService.findAvatarById(element.id_user);
            listaId.push(avatar);

            const listaUsuariosByIdList = await EventModel.find({'referencia':element.id}).exec();
            for (const [index, usuario] of listaUsuariosByIdList.entries()) {
                const avatar = await userService.findAvatarById(usuario.id_user);
                listaId.push(avatar);
            }
            // console.log(listaId);
            newListsAvatar.push(listaId);
            // console.log('---------------------------------------');
        }
        
        newLists.push(newListsAvatar);
        return newLists;
    }
}

module.exports = EventService;