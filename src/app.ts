import { config } from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import UserRouter from "./routes/user_router";

class App {
    app: Application;
    user_router: UserRouter;

    PORT: number;
    MONGODB_URI: string;

    constructor() {
        console.log("Initializing app...");
        config(); // Load environment variables from 'process.env'
        this.PORT = Number(process.env.PORT);
        this.MONGODB_URI = process.env.MONGODB_URI || "";
        this.app = express();
        this.user_router = new UserRouter();
        this.setup_routes();
    }

    public init(): void {
        this.config();
        this.run_server();
        this.connect_db();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if (req.method === 'OPTIONS') {
                res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
                return res.status(200).json({});
            }
            next();
        });
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
    }
}

const app = new App();
app.init();