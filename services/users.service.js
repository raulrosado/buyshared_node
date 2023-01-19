const UserModel = require('../Models/User.model')

class UserServices {
    constructor (user) {
        this.user = user;
      }

    async AddUser(){
        const newUser = new UserModel(this.user)
        return await newUser.save()
    }


}

module.export = UserServices