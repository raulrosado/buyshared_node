const ListModel = require('../../Models/List.model')
const TaskService = require('../task.service');
const UserService = require('../users.service');
const taskService = new TaskService();
const userService = new UserService();

class ListService {
    constructor() {}

    async AddList(list){
        const newListCreate = new ListModel(list)
        return await newListCreate.save()
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
            var avatar3 = {...avatar._doc,"idList":element.id}
            newListsAvatar.push(avatar3);
          }else{
            cant += await taskService.getCantByIdReference(element.referencia)
            try {
              listaUsuariosByReferenceList = await ListModel.find({'referencia':element.referencia}).exec();
              const listaUsuariosByIdList = await ListModel.findOne({'_id':element.referencia}).exec();
              const avatar2 = await userService.findAvatarById(listaUsuariosByIdList.id_user);
              var avatar3 = {...avatar2._doc,"idList":element.id}
              newListsAvatar.push(avatar3);
            } catch (e) {
            }
          }

          for (const [index, usuario] of listaUsuariosByReferenceList.entries()) {
              const avatar = await userService.findAvatarById(usuario.id_user);
              var avatar3 = {...avatar._doc,"idList":element.id}
              newListsAvatar.push(avatar3);
          }

          const course = {...element._doc,'cant':cant};
          newLists.push(course);
        }
        return newLists;
    }

    
    async findByIdUserAvatars(idUser){
        const query = ListModel.find({ 'id_user': idUser });
        let lists = await query.exec();
        let newLists = [];
        let newListsAvatar = [];
        let listaUsuariosByReferenceList

        for (const [index, element] of lists.entries()) {
          if(element.referencia === ''){
            listaUsuariosByReferenceList = await ListModel.find({'referencia':element.id}).exec();
            const avatar = await userService.findAvatarById(element.id_user);
            var avatar3 = {...avatar._doc,"idList":element.id}
            newListsAvatar.push(avatar3);
          }else{
            try {
              listaUsuariosByReferenceList = await ListModel.find({'referencia':element.referencia}).exec();
              const listaUsuariosByIdList = await ListModel.findOne({'_id':element.referencia}).exec();
              const avatar2 = await userService.findAvatarById(listaUsuariosByIdList.id_user);
              var avatar3 = {...avatar2._doc,"idList":element.id}
              newListsAvatar.push(avatar3);
            } catch (e) {
            }
          }

          for (const [index, usuario] of listaUsuariosByReferenceList.entries()) {
              const avatar = await userService.findAvatarById(usuario.id_user);
              var avatar3 = {...avatar._doc,"idList":element.id}
              newListsAvatar.push(avatar3);
          }
        }
        return newListsAvatar;
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

}

module.exports = ListService;
