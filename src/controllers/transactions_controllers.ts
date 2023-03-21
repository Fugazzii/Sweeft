import { Response, Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import Category from "../models/category";
import mongoose from "mongoose";
import { Status, Transaction } from "../models/category/category.interface";

export default class TransactionsController {

    constructor() {}

    public async add(req: Request, res: Response) {
        const token = req?.headers?.authorization?.split(` `)[1] as string;
        const { user: { email } } = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const { names, quantity, description } = req.body;

        const is_income = quantity > 0;

        const new_transaction: Transaction = {
            _id: new mongoose.Types.ObjectId(),
            description,
            quantity,
            date: new Date(),
        };

        /* I could not understand how to handle status, so Let's just randomize it ;D */
        const randomize = () => Math.random() > 0.5 ? Status.Processing : Status.Completed; 
        is_income ? new_transaction.status = randomize() : null;

        /* Add data to default category if name was not provided */
        if(!names) {
            let updated;
            if(is_income) {
                updated = await Category.updateOne(
                    { user_email: email, name: "Default" },
                    { $push: { "history.incomes" : new_transaction } }
                );
            } else {
                updated = await Category.updateOne(
                    { user_email: email, name: "Default" },
                    { $push: { "history.expenses" : new_transaction } }
                );
            }
            console.log(updated);
            return res.status(203).json({ success: true, data: `Added to transaction ${updated}` });
        }

        /* Assume that we get data following format { "names": "cat1,cat2" } */
        names.split(",").forEach(async (name: string) => {
            if(is_income) {
                await Category.updateMany(
                    { user_email: email, name },
                    { $push: { "history.incomes" : new_transaction } }
                );
            } else {
                await Category.updateMany(
                    { user_email: email, name },
                    { $push: { "history.expenses" : new_transaction } }
                );
            }
        });

        return res.status(203).json({ success: true, data: "Added transaction" });
    }
}