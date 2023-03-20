import { Schema } from "mongoose";
import { CategoryDocument, Expense, Income, Status, Transaction } from "./category.interface";

const TransactionSchema = new Schema<Transaction>({
    id: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true }
});

const ExpenseSchema = new Schema<Expense>({
    ...TransactionSchema.obj,
    status: { type: String, enum: Object.values(Status), required: true },
});

const IncomeSchema = new Schema<Income>({
    ...TransactionSchema.obj,
});

const CategorySchema = new Schema<CategoryDocument>({
    name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true
    },
    history: {
        incomes: [IncomeSchema],
        expenses: [ExpenseSchema],
    },
});

export default CategorySchema;