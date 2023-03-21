import { JwtPayload, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Category from "../models/category";
import { CategoryDocument } from "../models/category/category.interface";

export default class CategoryController {
    
    constructor() { }

    public async add(req: Request, res: Response, _next: NextFunction) {
        const token = req?.headers?.authorization?.split(` `)[1] as string;

        /* Decoded user */
        const { user: { email } } = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
        /* Name of the new category */
        const { name } = req.body;

        /* Check if category with similar name exists */
        const c = await Category.findOne({ name, user_email: email });
        if(c) {
            return res.status(400).json({ success: false, data: "Category already exists" });
        }

        try {
            const new_category = await Category.create({
                name, 
                user_email: email,
                history: {
                    incomes: [],
                    expenses: []
                }
            });

            res.status(201).json({ success: true, data: `Category has been successfully added ${new_category}` })
        } catch (error) {
            res.status(422).json({ success: false, data: `Failed to add category ${error}` });
        }
    }

    public async delete(req: Request, res: Response, _next: NextFunction) {
        const token = req?.headers?.authorization?.split(" ")[1] as string;
        const { user: { email } } = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const { name } = req.body;

        try {
            const { history } = await Category.findOne({ name, user_email: email }) as CategoryDocument;
            
            const move_to_default = await Category.updateOne(
                { name: "Default", user_email: email },
                { 
                    $push: { 
                        "history.incomes": history?.incomes,
                        "history.expenses": history?.expenses,
                    } 
                }
            );

            const c = await Category.deleteOne({ name, user_email: email });
            res.status(204).json({ success: true, data: `Item has been successfully deleted ${c}`});
        } catch (error) {
            res.status(404).json({ success: false, data: "Item not found" });
        }
    }

    public async rename(req: Request, res: Response, _next: NextFunction) {
        const token = req?.headers?.authorization?.split(` `)[1] as string;
        const { user: { email } } = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const { name, new_name } = req.body;
        try {
            const c = await Category.updateOne(
                { name, user_email: email },
                { $set: { name: new_name } }
            );
            res.status(204).json({ success: true, data: `Item has been successfully deleted ${c}`});
        } catch (error) {
            res.status(404).json({ success: false, data: "Item not found" });
        }
    }
}