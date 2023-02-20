const EventModel = require('../Models/Event.model')
const TaskService = require('./task.service');
const UserService = require('./users.service');
const taskService = new TaskService();
const userService = new UserService();
const fs = require('fs').promises

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
            let task =[]
            //cantidad de tareas en la lista
            // const cant = await taskService.getCantByIdList(element.id);
           
                task = await taskService.findByIdEvent(element.id);
            if(task.length === 0){
                task = await taskService.findByIdReference(element.referencia);
            }
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

    async getDetailEvent(idEvent){
        const query = EventModel.findOne({ '_id': idEvent });
        let lists = await query.exec();
        // console.log(lists);
        let newLists;  
        let newListsAvatar = [];
            let porC = 0;
            let taskComplet = 0;
            let task = []
            let taskRefer=[]
            task = await taskService.findByIdEvent(lists._id);
            if(lists.referencia !== ''){
                taskRefer = await taskService.findByIdReference(lists.referencia)
            }
            // //buscar los avatares de los usuarios de la lista
            let listaId = [];
            const avatar = await userService.findAvatarById(lists.id_user);
            listaId.push(avatar);

            const otrosEventos = await EventModel.find({ 'referencia': idEvent }).exec();
            for (const [index, event] of otrosEventos.entries()) {
                let taskR = await taskService.findByIdEvent(event._id);
                for (const [index, taskRef] of taskR.entries()) {
                    task.push(taskRef)
                }
            }

            const listaUsuariosByIdList = await EventModel.find({'referencia':lists._id}).exec();
            for (const [index, usuario] of listaUsuariosByIdList.entries()) {
                const avatar2 = await userService.findAvatarById(usuario.id_user);
                listaId.push(avatar2);
            }
            

            // console.log('---------------------------------------');
            const detail = {...lists._doc,'task':task,'taskReferencia':taskRefer,'avatar':listaId};
            return detail;
    }

    async delEvent(idEvent){
        const tasks = taskService.deleteAllTasksByIdEvent(idEvent)
        const event = EventModel.findOne({ '_id': idEvent});
        let eventInfo = await event.exec();
        fs.unlink(`./public/images/${eventInfo.bg}`)
        .then(() => {
            console.log('File removed')
        }).catch(err => {
            console.error('Something wrong happened removing the file', err)
        })
        const delEvent = await EventModel.deleteOne({ '_id': idEvent });
        delEvent.exec();
        return {
            'success':true
        }
    }
}

module.exports = EventService;