const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	name:String,
	apellidos:String,
	email:String,
	password:String,
	avatar:String,
	token:String,
	role:String,
	estado:Number
})

const User = mongoose.model('users',userSchema)
module.exports = User
