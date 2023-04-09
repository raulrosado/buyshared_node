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
        let listaUsuariosByReferenceList

        for (const [index, element] of lists.entries()) {
          let listaId = [];
          let cant = 0

          if(element.referencia === ''){
            cant += await taskService.getCantByIdReference(element.id)
            listaUsuariosByReferenceList = await ListModel.find({'referencia':element.id}).exec();

            const avatar = await userService.findAvatarById(element.id_user);
            listaId.push(avatar);
          }else{
            cant += await taskService.getCantByIdReference(element.referencia)
            try {
              listaUsuariosByReferenceList = await ListModel.find({'referencia':element.referencia}).exec();
              const listaUsuariosByIdList = await ListModel.findOne({'_id':element.referencia}).exec();
              const avatar2 = await userService.findAvatarById(listaUsuariosByIdList.id_user);
              listaId.push(avatar2);
            } catch (e) {
            }
          }

          for (const [index, usuario] of listaUsuariosByReferenceList.entries()) {
              // console.log(usuario.id_user)
              const avatar = await userService.findAvatarById(usuario.id_user);
              listaId.push(avatar);
          }

          // console.log("cantidad de tareas referencia"+cant)
          newListsAvatar.push(listaId);
          const course = {...element._doc,'cant':cant};
          newLists.push(course);
        }
        newLists.push(newListsAvatar);
        // console.log(newLists)
        return newLists;
    }

    async getDetailList(idList){
        let lists = await ListModel.findOne({ '_id': idList }).exec();
        let avatarList = [];
        let tasks = [];
        let cant = 0

        tasks = await taskService.findByIdList(idList);
        cant = await taskService.getCantByIdList(idList)
        let otrasListas = []
        const avatarU = await userService.findAvatarById(lists.id_user);
        avatarList.push(avatarU);

        if(lists.referencia !== ''){
            otrasListas = await ListModel.find({'_id':String(lists.referencia)}).exec();
        }else{
            otrasListas = await ListModel.find({'referencia':String(lists._id)}).exec();
        }

        for (const [index, user] of otrasListas.entries()) {
            const avatar = await userService.findAvatarById(user.id_user);
            avatarList.push(avatar);
        }

        for (const [index, list] of otrasListas.entries()) {
            cant += await taskService.getCantByIdReference(list.referencia)
            let taskR = await taskService.findByIdList(list._id);
            for (const [index, taskRef] of taskR.entries()) {
                tasks.push(taskRef)
            }
        }

        const taskList = [];
        const respuesta = {
            ...lists._doc,
            avatarList,
            tasks,
            'cant':cant
        };   
        return respuesta;
    }

    async delList(idList){
        const tasks = taskService.deleteAllTasksByIdList(idList)
        await ListModel.deleteOne({ '_id': idList }).exec();
        return {
            'success':true
        }
    }

    async findByIdList(idList){
        const query = ListModel.findOne({ '_id': idList });
        return await query.exec();
    }
}

module.exports = ListService;
