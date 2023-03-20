import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "../models/user";
import { UserDocument } from "../models/user";
import { Document, Types } from "mongoose";

interface AuthRequest extends Request {
    user?: (Document<unknown, {}, UserDocument> & Omit<UserDocument & {
        _id: Types.ObjectId;
    }, never>) | null;
}

export class AuthMiddleware {
    private static token: string | null = null;

    public static async is_auth(req: AuthRequest, res: Response, next: NextFunction) {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            AuthMiddleware.token = req.headers.authorization.split(` `)[1];
        }

        if(!AuthMiddleware.token) {
            return next(new Error('Not authorized'));
        }
    
        try {
            const decoded = verify(AuthMiddleware.token, process.env.JWT_SECRET as string) as JwtPayload;
            const user = await User.findOne({ _id: decoded.user._id });
    
            if(!user) {
                return next(new Error('User does not exist'));
            }

            req.user = user;
            next();
        } catch (error) {
            return next(new Error(`Not authorized. ${error}`));
        }
    }
}