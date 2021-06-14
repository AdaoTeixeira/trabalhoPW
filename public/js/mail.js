const nodemailer = require('nodemailler');
const smtpTransport = require('nodemailer-smtp-transport');

function sendMail(req,res){
const name = req.sanitize('name').escape();
const email = req.sanitize('email').escape();
const subject = req.sanitize('subject').escape();
req.checkBody("name", "Insira  texto", 'pt-PT').matches(/^[a-z] + $/i);
req.checkBody("email", "Insira email ").isEmail();
const errors = req.validationErrors();
if(errors){
    res.send(errors);
    return;
}
else{
    if (typeof(email) != "undefined" && typeof(subject) != "undefined" && typeof(name) != "undefined"){
let bodycontent = "";
bodycontent += 'Sr/a' + req.body.name + ', <br>' + '<br>';
bodycontent += 'Agradecemos pelo seu contacto' + '<br>' + 'Obrigado' + '<br>' + '<br>';
bodycontent += 'Mensagem enviada: <blockquote><i> ';
bodycontent += req.body.subject + '<br>' + '<br>' + 'mensagem enviada por' + req.body.name;
bodycontent += 'com o email <a href="mailto:' + req.body.email + '" target="_top">' + req.body.email + '</a>';
bodycontent +='</i></blockquote>';

bodycontent += '<img src="mail-button.png" alt="mail.icon" height="42" width="42" />';
console.log(bodycontent);

const transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user:'3rminho',
        pass: "QWErty123456789"
    }
}));
transporter.verify(function(error,success){
    if (error) {
        console.log(error);
        res.status(jsonMessages.mail.serverError.status).send(jasonMessages.mail.serverError);
    }
    else{
        console.log('Server is ready to take our messages');
    }
});
const mailOptions = {
    from: req.body.email,
    to: '3rminho@gmail.com',
    cc: req.body.email,
    subject: 'email de boas-vindas a pagina',
    html: bodycontent
}
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        res.status(jsonMessages.mail.mailError.status).send(jsonMessages.mail.mailError);
    }
    else{
        console.log('Email sent: ' + info.response);
        res.status(jsonMessages.mail.mailSent.status).send(jsonMessages.mail.requireSent);
    }
});
}

 else {
    res.status(jsonMessages.mail.requireData.status).send(jsonMessages.mail.requireData);
 }}
}