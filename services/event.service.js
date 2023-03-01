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
        let lists = await EventModel.find({ 'id_user': idUser }).exec();
        let newLists = [];
        let newListsAvatar = [];

        for (const [index, element] of lists.entries()) {
            let porC = 0;
            let taskComplet = 0;
            let task =[]
            let listaUsuariosByIdList
            let listaId = [];
            // const avatar = await userService.findAvatarById(element.id_user);
            // listaId.push(avatar);
            if(element.referencia === ""){
              // console.log("referencia vacia")
              task = await taskService.findByIdReferenceEvent(element.id);
              listaUsuariosByIdList = await EventModel.find({'referencia':element.id}).exec();
              const avatar = await userService.findAvatarById(element.id_user);
              listaId.push(avatar);
            }else{
              try {
                // console.log("tareas por referencia")
                listaUsuariosByIdList = await EventModel.find({'referencia':element.referencia}).exec();
                let refTask = await taskService.findByIdReferenceEvent(element.referencia);
                for (const [index, element] of refTask.entries()) {
                    task.push(element)
                }

                const listaUsuariosByIdEvent = await EventModel.findOne({'_id':element.referencia}).exec();
                const avatar2 = await userService.findAvatarById(listaUsuariosByIdEvent.id_user);
                console.log("avatar:"+avatar2)
                listaId.push(avatar2);
              } catch (e) {
              }
            }

            for (const [index, usuario] of listaUsuariosByIdList.entries()) {
              console.log(usuario.id_user)
                const avatar = await userService.findAvatarById(usuario.id_user);
                listaId.push(avatar);
            }

            for (const [index, element] of task.entries()) {
                if(element.estado == 2){
                    taskComplet++;
                }
            }
            porC = (taskComplet / task.length)*100;

            console.log("cantidad total:"+task.length)
            const course = {...element._doc,'cant':task.length,'complet':porC};
            newLists.push(course);
            newListsAvatar.push(listaId);
            console.log('---------------------------------------');
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
