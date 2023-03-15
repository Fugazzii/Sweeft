import { Router } from "express";
import UserController from "../controllers/user_controller";

export default class UserRouter {
    private router: Router;
    // controller: any; // !

    constructor() {
        this.router = Router();
        // this.controller = new UserController();
        this.setup();
    }

    private setup() {
        this.router.get('/', () => console.log("zd"));
        // this.router.post("/register", () => console.log("hello"));
        // this.router.post("/login", this.controller.login);
        // this.router.post("/reset", this.controller.reset_password);
    }

    public get_routes(): Router {
        return this.router;
    }
}