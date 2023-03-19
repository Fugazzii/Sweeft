import { createTransport } from "nodemailer";

type Options = {
    from: string,
    to?: string,
    subject: string,
    text: string
};

export default class SendEmail {
    transporter: any;

    constructor() {
        this.transporter = createTransport({
            host: "smtp.freeuni.edu.ge",
            auth: {
                user: "isich21@freeuni.edu.ge",
                pass: "IliamagariaIliamagaria"
            }   
        });
    }

    public async send(options: any) {
        let mail_options: Options = {
            from: "isich21@freeuni.edu.ge", 
            to: options.to,
            subject: options.subject,
            text: options.text
        };

        await this.transporter.sendMail(mail_options, function(err: any, info: any) {
            err ? console.log(err) : console.log(info);
        })
    }
}