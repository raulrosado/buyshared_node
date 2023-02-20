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
          let listaId = [];
          const avatar = await userService.findAvatarById(element.id_user);
          listaId.push(avatar);
          //cantidad de tareas en la lista
          let cant
          cant = await taskService.getCantByIdList(element.id);
          if(element.referencia !== ''){
            cant += await taskService.getCantByIdList(element.referencia);

            const listaUsuariosByReferenceList = await ListModel.findOne({'id':element.referencia}).exec();
            if(listaUsuariosByReferenceList !== null){
              const avatar2 = await userService.findAvatarById(listaUsuariosByReferenceList.id_user);
              if(listaUsuariosByReferenceList.id_user !== element.id_user){
                listaId.push(avatar2);
              }
            }
          }

          //buscar los avatares de los usuarios de la lista
          const listaUsuariosByIdList = await ListModel.find({'referencia':element.id}).exec();
          for (const [index, usuario] of listaUsuariosByIdList.entries()) {
              const avatar = await userService.findAvatarById(usuario.id_user);
              listaId.push(avatar);
              cant += await taskService.getCantByIdList(usuario.id); //busca la cantidad de tarea de las listas de otros usuarios
          }
          newListsAvatar.push(listaId);
          const course = {...element._doc,'cant':cant};
          newLists.push(course);
        }
        newLists.push(newListsAvatar);
        return newLists;
    }

    async getDetailList(idList){
        let lists = await ListModel.findOne({ '_id': idList }).exec();
        let avatarList = [];
        let tasks = [];

        tasks = await taskService.findByIdList(idList);
        let otrasListas = []
        console.log(lists.referencia)
        if(lists.referencia !== ''){
            otrasListas = await ListModel.find({'_id':String(lists.referencia)}).exec();
            console.log(otrasListas)
        }else{
            otrasListas = await ListModel.find({'referencia':String(lists._id)}).exec();
        }

        for (const [index, user] of otrasListas.entries()) {
            const avatar = await userService.findAvatarById(user.id_user);
            avatarList.push(avatar);
        }

        for (const [index, list] of otrasListas.entries()) {
            let taskR = await taskService.findByIdList(list._id);
            for (const [index, taskRef] of taskR.entries()) {
                tasks.push(taskRef)
            }
        }

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
