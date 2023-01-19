const mongoose = require('mongoose');
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb+srv://raulrosado91:N0t3lav0yad3c1r@buyshare.t3ffzxr.mongodb.net/test', 
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