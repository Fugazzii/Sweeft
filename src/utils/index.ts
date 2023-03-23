import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

export default class Utils {

    public static is_valid_email(email: string) : boolean {
        // Email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public static generate_reset_token(email: string): string {
        let rand = email + " " + randomBytes(16).toString('hex');
        let token = jwt.sign(
            rand,
            process.env.JWT_SECRET as string,
            { expiresIn: "10m" }
        );
        return token;
    }

}

