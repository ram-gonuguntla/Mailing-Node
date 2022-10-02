import { AWS, awsConfig } from './aws-config';
import { SendEmailResponse } from 'aws-sdk/clients/ses';
import { AWSError , SES } from 'aws-sdk';

AWS.config.update({
  accessKeyId: awsConfig.key,
  secretAccessKey: awsConfig.secret,
  region: awsConfig.ses.region
});

const ses: SES = new AWS.SES({ apiVersion: '2022-10-02' });

/**
 * @method sendMail
 * @param {Array} to array of mails to send content to
 * @param {String} subject Subject of mail to be sent
 * @param {String} message content of message in html template format
 * @param {String} from not required: mail to send email from
 * @returns {Promise} Promise
 */
export function sendMail(to: string[], subject: string, message: string, from?: string): Promise<SendEmailResponse> {
    const params = {
        Destination: {
        ToAddresses: to
        },
        Message: {
        Body: {
            Html: {
                Charset: process.env.CHARSET,
                Data: message
            },
            //replace Html attribute with the following if you want to send plain text emails.
            // Text: {
            //     Charset: "UTF-8",
            //     Data: message
            // }
        },
        Subject: {
            Charset: process.env.CHARSET,
            Data: subject
        }
        },
        ReturnPath: from || awsConfig.ses.from.default,
        Source: from || awsConfig.ses.from.default
    };
    return new Promise((resolve, reject) => {
        ses.sendEmail(params, (err: AWSError, data: SendEmailResponse) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
        });
    });
}