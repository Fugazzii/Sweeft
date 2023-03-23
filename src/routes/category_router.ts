import { Router } from "express";
import CategoryController from "../controllers/category_contoller";
import TransactionsController from "../controllers/transactions_controllers";
import { AuthMiddleware as middleware } from "../middlewares/auth";

export default class CategoryRouter {
    private router: Router;
    private category_controller: CategoryController;
    private transactions_controller: TransactionsController;
    constructor() {
        this.category_controller = new CategoryController();
        this.transactions_controller = new TransactionsController();
        this.router = Router();
        this.setup_category_routes();
        this.setup_transactions_routes();
    }

    private setup_category_routes() {
        /* Add / Delete / Rename Category */
        this.router.post("/add", middleware.is_auth, this.category_controller.add);
        this.router.delete("/delete", middleware.is_auth, this.category_controller.delete);
        this.router.put("/rename", middleware.is_auth, this.category_controller.rename);
    }

    private setup_transactions_routes() {
        this.router.put("/add_transaction", middleware.is_auth, this.transactions_controller.add);
        this.router.get(
            "/search_by_income/:email/:order",
            middleware.is_auth,
            this.transactions_controller.search_by_incomes
        );
        this.router.get(
            "/search_by_expense/:email/:order",
            middleware.is_auth,
            this.transactions_controller.search_by_expenses
        );
        this.router.get(
            "/search_by_status/:email", 
            middleware.is_auth,
            this.transactions_controller.search_by_status
        );
        this.router.get(
            "/search_by_date/:email", 
            middleware.is_auth,
            this.transactions_controller.search_by_date
        );
    }

    public get_routes(): Router {
        return this.router;
    }
}