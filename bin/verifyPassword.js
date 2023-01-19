const bcrypt = require('bcrypt');

async function verifyPassword(passwors,hash){
    return await bcrypt.compare(passwors,hash);
}

module.exports = {
    "verifyPassword" : verifyPassword
}