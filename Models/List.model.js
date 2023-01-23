const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
	id_user:String,
	nombre:String,
	estado:Number
})

const List = mongoose.model('listas',listSchema)
module.exports = List

