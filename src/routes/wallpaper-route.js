"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallpaperRouter = void 0;
const express_1 = require("express");
const multer_middleware_1 = __importDefault(require("../middlewares/multer-middleware"));
const wallpaper_controller_1 = require("../controllers/wallpaper-controller");
const wallpaperRouter = (0, express_1.Router)();
exports.wallpaperRouter = wallpaperRouter;
wallpaperRouter
    .route("/add-wallpaper")
    .post(multer_middleware_1.default.single("wallpaperImage"), wallpaper_controller_1.addWallpaperController);
wallpaperRouter
    .route("/add-wallpaper-bulk")
    .post(multer_middleware_1.default.array("wallpapers"), wallpaper_controller_1.addBulkWallpapersController);
wallpaperRouter
    .route("/get-wallpaper/:category")
    .get(wallpaper_controller_1.getWallpapersByCategoryController);
