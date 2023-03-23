import { Response, Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import Category from "../models/category";
import mongoose from "mongoose";
import { CategoryDocument, Status, Transaction } from "../models/category/category.interface";
import { Buffer } from "buffer";

export default class TransactionsController {

    constructor() { 
        this.add = this.add.bind(this);
    }

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
        const randomize = (): Status => Math.random() > 0.5 ? Status.Processing: Status.Completed; 
        !is_income ? new_transaction.status = randomize() : null;

        /* Add data to default category if name was not provided */
        if(!names) {
            is_income 
                ? await this.add_incomes(email, "Default", new_transaction)
                : await this.add_expenses(email, "Default", new_transaction);

                return res.status(  201).json({ success: true, data: `Added transaction` });
        }

        /* Assume that we get data following format { "names": "cat1,cat2" } */
        const promises = names.split(",").map(async (name: string) => {
            is_income 
                ? await this.add_incomes(email, name, new_transaction) 
                : await this.add_expenses(email, name, new_transaction);
        });
        await Promise.all(promises);

        return res.status(201).json({ success: true, data: "Added transaction" });
    }

    private async add_incomes(email: string, name: string, new_transaction: Transaction) {
        await Category.updateMany(
            { user_email: email, name },
            { $push: { "history.incomes" : new_transaction } }
        );
    }

    private async add_expenses(email: string, name: string, new_transaction: Transaction) {
        await Category.updateMany(
            { user_email: email, name },
            { $push: { "history.expenses" : new_transaction } }
        );
    }

    public async search_by_incomes(req: Request, res: Response){
        const { email, order } = req.params;
        try {
            const user_categories = await Category.find({ user_email: email }) as CategoryDocument[];
            const user_incomes = user_categories.map(c => c.history.incomes)[0];
            
            let data;
            switch(order) {
                case "asc":
                case "ascending":
                case "1":
                    data = user_incomes.sort((a, b) => a.quantity - b.quantity);
                    break;

                case "desc":
                case "descending":
                case "0":
                    data = user_incomes.sort((a, b) => b.quantity - a.quantity);
                    break;
            }
            res.status(200).json({ success: true, data: data })
        } catch (error) {
            res.status(500)
        } 
    }

    public async search_by_expenses(req: Request, res: Response){
        const { email, order } = req.params;
        try {
            const user_categories = await Category.find({ user_email: email }) as CategoryDocument[];
            const user_expenses = user_categories.map(c => c.history.expenses)[0];

            let data;
            switch(order) {
                case "asc":
                case "ascending":
                case "1":
                    data = user_expenses.sort((a, b) => a.quantity - b.quantity);
                    break;

                case "desc":
                case "descending":
                case "0":
                    data = user_expenses.sort((a, b) => b.quantity - a.quantity);
                    break;
            }
            res.status(200).json({ success:true, data })
        } catch (error) {
            res.status(500)
        } 
    }

    public async search_by_status(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const user_categories = await Category.find({ user_email: email }) as CategoryDocument[];
            const user_expenses = user_categories.map(c => c.history.expenses)[0];
            
            let data = user_expenses.sort((a, b) => a.quantity - b.quantity);

            res.status(200).json({ success: true, data })
        } catch (error) {
            res.status(500);
        }
    }

    public async search_by_date(req: Request, res: Response) {
        const { email } = req.params;
        
        try {
            const user_categories = await Category.find({ user_email: email }) as CategoryDocument[];
            const user_expenses = user_categories.map(c => c.history.expenses)[0];

            let data = user_expenses.sort((a, b) => a.date.getTime() - b.date.getTime());

            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500);
        }
    }

}