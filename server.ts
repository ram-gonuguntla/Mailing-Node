const express = require('express')
const app = express();
const dotenv = require('dotenv');
var cors = require('cors')
dotenv.config();
const options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
const port = process.env.PORT || 3000;

import { publishMessage } from './src/rabbitmq-connection';

app.use(express.static(__dirname+'/'));

app.get('/', (_: any, res: any)=>{
    res.sendFile(__dirname + '/index.html');
});

app.options('*', cors(options));

/**
 * @post send email
 */
app.post('/send', (req: any, res: Record< string, Function>) => {
    const { body: { email, emailMsg, subject } } = req;
    const emailOptions = {
      mail: [email],
      subject: subject,
      template: emailMsg
    }
    // call rabbitmq service to app mail to queue
    publishMessage(emailOptions);
    return res.status(202).send({
      message: 'Email sent successfully'
    })
})

app.get('/consume', (_: any, res: any)=> {res.send('Ok')})

app.listen(port, () => {
    console.log("local server:", port)
})