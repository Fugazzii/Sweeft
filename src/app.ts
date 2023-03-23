import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { connect } from "mongoose";

import UserRouter from "./routes/user_router";
import CategoryRouter from "./routes/category_router";

class App {
    app: Application;
    user_router: UserRouter;
    category_router: CategoryRouter;

    PORT: number;
    MONGODB_URI: string;

    constructor() {
        console.log("Initializing app...");
        config(); // Load environment variables from 'process.env'
        this.PORT = Number(process.env.PORT);
        this.MONGODB_URI = process.env.MONGODB_URI || "";
        this.app = express();
        this.user_router = new UserRouter();
        this.category_router = new CategoryRouter();
    }

    public init(): void {
        this.config();
        this.run_server();
        this.connect_db();
        this.setup_routes();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private run_server() {
        this.app.listen(this.PORT, () => console.log(`Server has established at ${this.PORT}`));
    }

    private async connect_db() {
        console.log("Connecting to the database...");
        try {
            await connect(this.MONGODB_URI);
        } catch (error) {
            throw new Error(`Error while connecting to the database ${error}`);
        }
        console.log(`Successfully Connected`);
    }

    private setup_routes(): void {
        this.app.use('/api/user', this.user_router.get_routes());
        this.app.use('/api/category', this.category_router.get_routes());
    }
}

const app = new App();
app.init();