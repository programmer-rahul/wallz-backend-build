"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connection_1 = __importDefault(require("./src/config/db-connection"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const wallpaper_route_1 = require("./src/routes/wallpaper-route");
const category_route_1 = require("./src/routes/category-route");
const cloudinary_1 = require("./src/config/cloudinary");
const redis_1 = require("./src/config/redis");
dotenv_1.default.config({
    path: ".env",
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
// routes
app.use("/wallpaper", wallpaper_route_1.wallpaperRouter);
app.use("/category", category_route_1.categoryRouter);
(0, db_connection_1.default)()
    .then(() => {
    (0, cloudinary_1.connectCloudinary)();
    (0, redis_1.connectRedis)();
    app.listen(PORT, () => {
        "Server is running!";
    });
})
    .catch((err) => {
    console.log("Database connection error :- ", err);
});
