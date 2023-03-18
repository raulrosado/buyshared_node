const SolicitudesModel = require('../Models/Solicitudes.model')
var emailServer = require('../bin/mail_config.js')
const UserService = require('./users.service');
const ListService = require('./list.service');
const EventService = require('./event.service');
const userService = new UserService();
const listService = new ListService();
const eventService = new EventService();

class SolicitudesService {
    constructor() {}
    async addSolicitud(newSolicitud){
        const cantSol = SolicitudesModel.find({ 'id_user': newSolicitud.id_user,'id_lista': newSolicitud.id_lista,'id_evento':newSolicitud.id_evento,'email':newSolicitud.email }).count();
        const count = await cantSol.exec();
        let result = false
        if(count === 0){
          const newSolicitudCreate = new SolicitudesModel(newSolicitud)
          await newSolicitudCreate.save()

          const userInfo = await userService.findOne(newSolicitud.id_user)
          let infoEvent;
          let infoList;
          let nombreList="";
          if(newSolicitud.id_lista === 0){
            infoEvent = await eventService.getInfoEvent(newSolicitud.id_evento)
            nombreList = infoEvent.nombre
          }else{
            infoList = await listService.findByIdList(newSolicitud.id_lista)
            nombreList = infoList.nombre
          }
          const solicitud = await SolicitudesModel.findOne({ 'id_user': newSolicitud.id_user,'id_lista': newSolicitud.id_lista,'id_evento':newSolicitud.id_evento,'email':newSolicitud.email }).exec();

          const info = {
            usuarioNombre: userInfo.name,
            nombreList:nombreList,
            token:solicitud.token
          }
          emailServer(null,newSolicitud.email,"addFriend",info)
          result = true
        } else {
          result = false
        }
        return result
    }

    async find(){
        return SolicitudesModel.find().exec();
    }
}

module.exports = SolicitudesService;
