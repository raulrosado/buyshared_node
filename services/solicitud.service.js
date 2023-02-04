const SolicitudesModel = require('../Models/Solicitudes.model')

class SolicitudesService {
    constructor() {}
    async addSolicitud(newSolicitud){
        const newSolicitudCreate = new SolicitudesModel(newSolicitud)
        return await newSolicitudCreate.save()
    }

    async find(){
        return SolicitudesModel.find().exec();
    }

    // async findByIdUser(idUser){
    //     const query = TaskModel.find({ 'id_user': idUser });
    //     const list = await query.exec();
    //     return list;
    // }
    // async findByIdList(idList){
    //     const query = TaskModel.find({ 'id_lista': idList });
    //     const list = await query.exec();
    //     return list;
    // }
    // async getCantByIdList(idList){
    //     const query = TaskModel.find({ 'id_lista': idList }).count();
    //     const count = await query.exec();
    //     return count;
    // }
    // async findByIdEvent(idEvent){
    //     const query = TaskModel.find({ 'id_evento': idEvent });
    //     const list = await query.exec();
    //     return list;
    // }
    // async findByIdReference(id){
    //     const query = TaskModel.find({ 'referencia': idEvent });
    //     const list = await query.exec();
    //     return list;
    // }
}

module.exports = SolicitudesService;