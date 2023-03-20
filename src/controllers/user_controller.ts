import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { compare } from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import Category from "../models/category";
// import SendEmail from "../utils/send_email";

export default class UserController {

    constructor() {
        
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        // let sender = new SendEmail();
        try {
            const user = await User.findOne({ email });
            /* Check if user exists */
            if(user) return res.status(404).json("User is already registered, please log in");
            
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

            /*
                const payload = { user: { email, password } };
                const hash_info = jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn: "1hr"});

                const verification_url = `http://localhost:3000/verify?hash_info=${hash_info}`;

                const msg = `<h1>You have requested a password reset</h1>
                <p>Please go to this link</p>
                <a href=${verification_url} clicktracking="off">${verification_url}</a>`;

                sender.send({
                    to: email,
                    subject: `Follow this url to verify ${verification_url}`,
                    text: msg
                });

                res.status(200).json({ success: true, data: verification_url });
            */
        } catch (error) {
            res.status(500).json(`Failed to register user ${error}`);
        } finally {
            next();
        }
    }

    // public async verify_register(req: Request, res: Response, next: NextFunction) {
    //     const { hash_info } = req.params;

    //     const decoded_user = jwt.verify(hash_info, process.env.JWT_SECRET_KEY || "");
    //     const { email, password } = decoded_user;
    //     try {
    //         const new_user = await User.create({ email, password });
    //         res.status(201).json({new_user});
    //     } catch (error) {
            
    //     }
    // }

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
        res.json("Nice");
    }
}