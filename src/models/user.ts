import { model, Schema, Model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

export interface UserDocument {
    email: string,
    password: string
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await genSalt(10);
        const hashed = await hash(this.password, salt);
        this.password = hashed;
        return next();
    } catch (error) {
        return next(error);
    }
});

const User = model("User", UserSchema);
export default User;