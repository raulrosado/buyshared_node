const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const config = {
    port:process.env.PORT || 5000,
    db_user:process.env.DB_USER,
    db_password:process.env.DB_PASSWORD,
    db_name:process.env.DB_DBNAME,
    apiKey:process.env.API_KEY,
    jwtSecret:process.env.JWT_SECRET,
    user:process.env.EMAIL_USER,
    clientId:process.env.EMAIL_CLIENTID,
    clientSecret:process.env.EMAIL_CLIENTSECRET,
    refreshToken:process.env.EMAIL_REFRESHTOKEN
}

module.exports = {config};
