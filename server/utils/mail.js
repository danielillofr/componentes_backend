const nodemailer = require('nodemailer');

const { emailSender } = require('./../config/maillists')

function Enviar_mail(valores) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailSender.usuario,
            pass: emailSender.password
        }
    });
    transporter.sendMail(valores, (err, info) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            console.log('Email sent');
        }
    })
}

module.exports = { Enviar_mail }