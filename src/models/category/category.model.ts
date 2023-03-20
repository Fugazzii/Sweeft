import { model } from "mongoose";
import { CategoryDocument } from "./category.interface";
import CategorySchema from "./category.schema";

export const Category = model<CategoryDocument>("Category", CategorySchema);