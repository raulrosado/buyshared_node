const EventModel = require('../../Models/Event.model')
const TaskService = require('../task.service');
const UserService = require('../users.service');
const taskService = new TaskService();
const userService = new UserService();
const fs = require('fs').promises

class EventService {
    constructor() {}

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

            if(element.referencia === ""){
              task = await taskService.findByIdReferenceEvent(element.id);
              listaUsuariosByIdList = await EventModel.find({'referencia':element.id}).exec();

              const avatar = await userService.findAvatarById(element.id_user);
              listaId.push(avatar);
            }else{
              try {
                listaUsuariosByIdList = await EventModel.find({'referencia':element.referencia}).exec();
                let refTask = await taskService.findByIdReferenceEvent(element.referencia);
                for (const [index, element] of refTask.entries()) {
                    task.push(element)
                }

                const listaUsuariosByIdEvent = await EventModel.findOne({'_id':element.referencia}).exec();
                const avatar2 = await userService.findAvatarById(listaUsuariosByIdEvent.id_user);
                listaId.push(avatar2);
              } catch (e) {
              }
            }

            for (const [index, usuario] of listaUsuariosByIdList.entries()) {
            
                const avatar = await userService.findAvatarById(usuario.id_user);
                listaId.push(avatar);
            }

            for (const [index, element] of task.entries()) {
                if(element.estado == 2){
                    taskComplet++;
                }
            }
            porC = (taskComplet / task.length)*100;
            var complet = 0
            if(porC <= 0 ){
                complet = 0
            }

            // console.log("cantidad total:"+task.length)
            const course = {...element._doc,'cant':task.length,'complet':complet,'taskcomplet':taskComplet};
            newLists.push(course);
            newListsAvatar.push(listaId);
        }

        // newLists.push(newListsAvatar);
        return newLists;
    }
}	

module.exports = EventService;