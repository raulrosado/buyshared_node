var nodemailer = require('nodemailer');
const path = require('path')
// const config = require('./mailConfig.js')
const {config} = require('./config');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret)
OAuth2_client.setCredentials({refresh_token: config.refreshToken})

function send_mail(name,recipient,option,info){
  const accessToken = OAuth2_client.getAccessToken()

  var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER || 'gmail',
  auth: {
    type: "OAuth2",
    user:config.user,
    clientId:config.clientId,
    clientSecret: config.clientSecret,
    refreshToken:config.refreshToken,
    accessToken:accessToken
  }
  });

  var mailOptions = {
   from: '"BuyShare 🛒" <raulrosado91dev@gmail.com>',
   to: recipient,
   subject: 'BuyShare, comparte tus compras',
   html: get_html_message(name,option,info)
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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
        <a href="https://raulrosado.github.io/buyshared_react/accept/${info.token}">Aceptar invitación</a>
      `
    break;
  }
}

module.exports = send_mail
