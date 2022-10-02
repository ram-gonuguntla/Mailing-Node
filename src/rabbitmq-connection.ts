import { sendMail } from './email';
import {Channel, Connection, ConsumeMessage} from 'amqplib';
const dotenv = require('dotenv');
dotenv.config();

const queue = 'email-node';

const openConnection: Promise<Connection> = require('amqplib').connect(process.env.AMQP_SERVER);

// Publisher
export const publishMessage = (payload: any) => openConnection.then((connection: Connection) => connection.createChannel())
  .then((channel: Channel) => channel.assertQueue(queue)
    .then(() => channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))))
  .catch((error: Error) => console.warn(error));

// Consumer
export const consumeMessage = () => {
    openConnection.then((connection: Connection) => connection.createChannel()).then((channel: Channel) => channel.assertQueue(queue).then(() => {
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    return channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const { mail, subject, template } = JSON.parse(msg.content.toString());
        console.log(' [x] Received %s', mail);
        // send email via aws ses
        sendMail(mail, subject, template).then(() => {
          channel.ack(msg);
        });
      }
    });
  })).catch((error: Error) => console.warn(error));
};

require('make-runnable');