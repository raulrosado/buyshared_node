const SolicitudesModel = require('../Models/Solicitudes.model')
var emailServer = require('../bin/mail_config.js')
var emailServer_MailJet = require('../utils/Mail/Mailjet/Mailjet.js')
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
          // emailServer(null,newSolicitud.email,"addFriend",info)
          emailServer_MailJet(null,newSolicitud.email,"addFriend",info)
          result = {
            success:true,
            message:'Se envio la solicitud'
          }
        } else {
          result = {
            success:false,
            message:'No se envio la solicitud'
          }
        }
        return result
    }

    async find(){
        return SolicitudesModel.find().exec();
    }

    async findByToken(token){
        return await SolicitudesModel.findOne({'token':token}).exec();
    }

    async actionSolicitud(parametros){
        let resp
        const infoSolicitud = await SolicitudesModel.findOne({'token':parametros.token}).exec();
        if(infoSolicitud !== null){
        switch (parametros.action) {
          case 1:
            await SolicitudesModel.deleteOne({'token':parametros.token}).exec();
            resp = {
              success:true,
              message:'Se elimino la solicitud'
            }
            break;
          case 2:
            let infoEvent;
            let infoList;
            let infoUser = await userService.findByEmail(infoSolicitud.email)
            if(infoSolicitud.id_lista === '0'){
                console.log('idLista en cero')
                infoEvent = await eventService.getInfoEvent(infoSolicitud.id_evento)
                const eventParams = {
                    id_user: infoUser._id,
                    nombre: infoEvent.nombre,
                    bg: infoEvent.bg,
                    estado: infoEvent.estado,
                    referencia: infoSolicitud.id_evento,
                  };
                const list = await eventService.AddEvent(eventParams);
            }else{
              infoList = await listService.findByIdList(infoSolicitud.id_lista)
              const listParams = {
                id_user: infoUser._id,
                id_event: "",
                nombre: infoList.nombre,
                estado: infoList.estado,
                referencia: infoSolicitud.id_lista,
              };
              const list = await listService.AddList(listParams).then;
            }
            resp = {
              success:true,
              message:'Se acepto la solicitud'
            }
            break;
          default:
        }
        await SolicitudesModel.deleteOne({'token':parametros.token}).exec();
    }else{
      resp = {
        success:false,
        message:'No se encuentra la solicitud'
      }

    }
    return resp
}
}

module.exports = SolicitudesService;
