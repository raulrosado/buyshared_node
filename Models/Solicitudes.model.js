const mongoose = require('mongoose')

const solicitudesSchema = mongoose.Schema({
	id_user:String,
	id_lista:String,
	id_evento:String,
	token:String,
	estado:Number
})

const Solicitudes = mongoose.model('solicitudes',solicitudesSchema)
module.exports = Solicitudes

