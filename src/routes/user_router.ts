import { Router } from "express";
import UserController from "../controllers/user_controller";
import { AuthMiddleware } from "../middlewares/auth";

export default class UserRouter {
    private router: Router;
    controller: UserController; // !

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.setup();
    }

    private setup() {
        this.router.post("/register", this.controller.register);
        this.router.post("/login", this.controller.login);
        this.router.post("/reset", AuthMiddleware.is_auth, this.controller.reset_password);
    }

    public get_routes(): Router {
        return this.router;
    }
}