import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { compare } from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import Category from "../models/category";
import { SendMail } from "../utils/send_email";
import Utils from "../utils";
import { randomBytes } from "crypto";

export default class UserController {

    constructor() { }

    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if(!Utils.is_valid_email(email)) {
            return res.status(422).json({ success: false, data: "Invalid email" });
        }

        try {
            const user = await User.findOne({ email });
            /* Check if user exists */
            if(user) return res.status(404).json("User is already registered, please log in");
            
            const payload = { user: { email, password } };
            await UserController.send_verification_link(payload);

            res.status(200).json({ success: true, data: "Verification url sent to your email" });
        } catch (error) {
            res.status(500).json(`Failed to register user, ${error}`);
        } finally {
            next();
        }
    }

    private static async send_verification_link(payload: any): Promise<string> {
        const hash_info = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "3hr"});

        const PORT = process.env.PORT as string;
        const verification_url = `http://${process.env.DOMAIN}:${PORT}/api/user/verify/${hash_info}`;

        const msg = `<h1>Verify our email</h1>
        <p>Please go to this link</p>
        <a href=${verification_url} clicktracking="off">${verification_url}</a>`;

        await SendMail({
            to: payload.user.email,
            subject: `Verify your email address`,
            html: msg
        });

        return verification_url;
    }

    public async verify_register(req: Request, res: Response, next: NextFunction) {
        const { hash_info } = req.params;

        const decoded_user = jwt.verify(hash_info, process.env.JWT_SECRET as string) as JwtPayload;
        const { user: { email, password } } = decoded_user;

        try {
            const new_user = await User.create({ email, password });
            const default_category = await Category
            .create({ 
                name: "Default",
                user_email: email,
                history: {
                    incomes: [],
                    expenses: []
                }
            });

            res.status(201).json({ 
                success: true, 
                data: `
                    User with default category ${default_category}
                    has successfully been added ${new_user}` 
            });
        } catch (error) {
            res.status(422).json({ success: false, data: `Could not add user. ${error}` });
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            /* Check if user exists */
            if(!user) return res.status(404).json("User is not registered");
            
            /* Check if passwords match */
            const is_match = await compare(password, user.password);
            if(!is_match) return res.status(400).json("Passwords do not match");
            
            const payload = { user: { _id: user._id, email: user.email } };
            const jwt_secret: Secret = process.env.JWT_SECRET || "";
            const token = jwt.sign(payload, jwt_secret, { expiresIn: "1h" });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async reset_password(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            /* Check if user exists */
            if(!user) return res.status(404).json("User is not registered");
            
            let hashed_token = email + " " + randomBytes(16).toString('hex');
            let payload = { token: hashed_token };
            let reset_token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "10m" });
            const reset_url = `http://${process.env.DOMAIN}:${process.env.PORT}/api/user/reset/${reset_token}`;

            await SendMail({
                to: email,
                subject: "Reset url",
                html: `<a href="${reset_url}">Follow this link</a>`
            });

            res.status(200).json({ success: true, data: `Reset url has been sent` });
        } catch (error) {
            res.status(500).json({ success: false, data: error });
        }
    }

    public async change_password(req: Request, res: Response, next: NextFunction) {
        const { new_password } = req.body;
        const { token } = req.params;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const email = decoded.token.split(" ")[0];
            const user = await User.findOne({ email });

            if(!user) return res.status(404);

            user.password = new_password;
            await user?.save();
            res.status(200).json({ success: true, data: "Password has successfully been changed" });
        } catch (error) {
            res.status(500).json({ success: false, data: "Failed to change password" });
        }
    }
}