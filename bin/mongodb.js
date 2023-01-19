const mongoose = require('mongoose');

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
console.log(process.env.DB_DBNAME);

    mongoose.set('strictQuery', false);
    const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@buyshare.t3ffzxr.mongodb.net/${process.env.DB_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(uri, 
        {
            connectTimeoutMS: 1000,
            useNewUrlParser:true,
            useUnifiedTopology:true
        }
    )
    .then(
        console.log('Conexion exitosa')
    )
    .catch( e => console.log(e));