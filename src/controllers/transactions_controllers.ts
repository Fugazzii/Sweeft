import { Response, Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import Category from "../models/category";
import mongoose from "mongoose";
import { Status, Transaction } from "../models/category/category.interface";

export default class TransactionsController {

    constructor() {}

    public async add(req: Request, res: Response) {
        const token = req?.headers?.authorization?.split(` `)[1] as string;
        const { user: { user_email } } = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const { names, quantity, description } = req.body;

        const is_income = quantity > 0;

        const new_transaction: Transaction = {
            _id: new mongoose.Types.ObjectId(),
            description,
            quantity,
            date: new Date(),
        };

        is_income ? new_transaction.status = Status.Processing : null;

        if(!names) {
            let updated;
            if(is_income) {
                updated = await Category.updateOne(
                    { user_email, name: "Default" },
                    { $push: { "history.incomes" : new_transaction } }
                );
            } else {
                updated = await Category.updateOne(
                    { user_email, name: "Default" },
                    { $push: { "history.expenses" : new_transaction } }
                );
            }
            console.log(updated);
            return res.status(203).json({ success: true, data: `Added to transaction ${updated}` });
        }

        names.forEach(async (name: string) => {
            if(is_income) {
                await Category.updateMany(
                    { user_email, name },
                    { $push: { "history.incomes" : new_transaction } }
                );
            } else {
                await Category.updateMany(
                    { user_email, name },
                    { $push: { "history.expenses" : new_transaction } }
                );
            }
        });

        return res.status(203).json({ success: true, data: "Added transaction" });
    }
}