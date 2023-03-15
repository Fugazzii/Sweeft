import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true
    }
});

const User = model("User", UserSchema);
export default User;