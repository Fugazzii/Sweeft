import SibApiV3Sdk from 'sib-api-v3-sdk';

interface MailOptions {
    to: string,
    subject: string,
    html: string
}

export const SendMail = async ({ to, subject, html }: MailOptions) => {
    const apiKey = process.env.API_KEY;

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKey;
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to as string }];
    sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL, name: 'Sweeft intern' };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    
    await apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function(data: any) {
            console.log('Email sent successfully.');
        })
        .catch(function(error: any) {
            console.error('Error sending email:', error);
        });
}

