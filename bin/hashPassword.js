const bcrypt = require('bcrypt');

async function hashPassword(passwors){
    const hash = await bcrypt.hash(passwors,10);
    console.log(hash)
    return hash;
}

module.exports = {
    "hashPassword" : hashPassword
}