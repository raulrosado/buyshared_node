const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
	id_user:String,
	id_event:String,
	nombre:String,
	estado:Number,
	referencia:String
})

const List = mongoose.model('listas',listSchema)
module.exports = List

