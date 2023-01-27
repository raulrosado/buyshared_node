const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
	id_user:String,
	id_lista:String,
	id_evento:String,
	texto:String,
	estado:Number,
	referencia:String
})

const Tasks = mongoose.model('tasks',taskSchema)
module.exports = Tasks

