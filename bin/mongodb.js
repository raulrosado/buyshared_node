const mongoose = require('mongoose');
const {config} = require('./config');

    mongoose.set('strictQuery', false);
    const uri =`mongodb+srv://${config.db_user}:${config.db_password}@buyshare.t3ffzxr.mongodb.net/${config.db_name}?retryWrites=true&w=majority`;
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