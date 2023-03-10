const SolicitudesModel = require('../Models/Solicitudes.model')

class SolicitudesService {
    constructor() {}
    async addSolicitud(newSolicitud){
        const cantSol = SolicitudesModel.find({ 'id_user': newSolicitud.id_user,'id_lista': newSolicitud.id_lista,'id_evento':newSolicitud.id_evento,'email':newSolicitud.email }).count();
        const count = await cantSol.exec();
        let result = false
        if(count === 0){
          const newSolicitudCreate = new SolicitudesModel(newSolicitud)
          await newSolicitudCreate.save()
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
