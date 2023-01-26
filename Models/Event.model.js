const mongoose = require('mongoose')

const EventSchema = mongoose.Schema({
	id_user:String,
	nombre:String,
	bg:String,
	estado:Number,
	referencia:String
})

const Event = mongoose.model('eventos',EventSchema)
module.exports = Event

