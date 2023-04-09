const Mailjet = require('node-mailjet');
const path = require('path')
// const config = require('./mailConfig.js')
const {config} = require('../../../bin/config');

function sendMail_MailJet(name,recipient,option,info){

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);

const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "raulrosado91@gmail.com",
                Name: "BuyShared 🛒"
              },
              To: [
                {
                  Email: recipient,
                  Name: name
                }
              ],
              Subject: 'BuyShared, comparte tus compras',
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: get_html_message(name,option,info)
            }
          ]
        })

request
    .then((result) => {
        console.log("Email enviado: "+recipient)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
}

function get_html_message(name,option,info){
      switch (option) {
        case 'addUser':
          return `
            <h3>Hola, <strong>${name}</strong></h3>
            <p>Gracias por registrarte en nuestra aplicación, esperamos que la disfrute y que le sea útil.</p>
          `
        break;
        case 'addFriend':
        console.log("addFriend")
          return `
            <h3>Hola</h3>
            <p>El usuario ${info.usuarioNombre} , lo ha agregado a la lista de compra ${info.nombreList} . acceda al vínculo enviado para autorizar su participación.</p>
            <a href="https://raulrosado.github.io/buyshared_react/#/accept/${info.token}">Aceptar invitación</a>
          `
        break;
      }
    }

module.exports = sendMail_MailJet
