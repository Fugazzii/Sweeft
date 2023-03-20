import { Types } from "mongoose";

export abstract class Transaction {
    public _id: Types.ObjectId;
    public quantity: number;
    public description: string;
    public date: Date;
    public status?: Status;
    
    constructor(_id: Types.ObjectId, quantity: number, description: string, date: Date) {
        this._id = _id;
        this.quantity = quantity;
        this.description = description,
        this.date = date;
    }
}

export enum Status { 
    Processing = "Processing",
    Completed = "Completed"
};

export class Expense extends Transaction {
    public status: Status;
    constructor(_id: Types.ObjectId, quantity: number, description: string, date: Date, status: Status) {
        super(_id, quantity, description, date);
        this.status = status;
    }
}

export class Income extends Transaction {
    constructor(_id: Types.ObjectId, quantity: number, description: string, date: Date) {
        super(_id, quantity, description, date);
    }
}


export interface CategoryDocument {
    name: string,
    user_email: string, 
    history: {
        incomes: Income[],
        expenses: Expense[]
    }
}