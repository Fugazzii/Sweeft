import { Router } from "express";
import UserController from "../controllers/user_controller";

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
        this.router.post("/verify/:hash_info", this.controller.verify_register);
        this.router.post("/login", this.controller.login);
        this.router.post("/reset", this.controller.reset_password);
        this.router.put("/reset/:token", this.controller.change_password);
    }

    public get_routes(): Router {
        return this.router;
    }
}