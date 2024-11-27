"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category-controller");
const categoryRouter = (0, express_1.Router)();
exports.categoryRouter = categoryRouter;
categoryRouter.route("/get-categories").get(category_controller_1.getAllCategoriesController);
