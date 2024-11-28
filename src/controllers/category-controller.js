"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesController = void 0;
const wallpaper_schema_1 = __importDefault(require("../models/wallpaper-schema"));
const redis_1 = require("../config/redis");
const getAllCategoriesController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = "categories";
        // Check Redis cache
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            res.status(200).json({ allCategories: JSON.parse(cachedData) });
            return;
        }
        // Fetch categories from database
        const categories = yield wallpaper_schema_1.default.aggregate([
            {
                $group: {
                    _id: "$category", // Group by category
                    previewUrl: { $first: "$url" }, // Use the first image URL as preview
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    previewUrl: 1,
                },
            },
        ]);
        if (!categories.length) {
            res.status(404).json({ error: "No categories found" });
            return;
        }
        // Cache categories in Redis for 1 hour
        yield redis_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(categories));
        res.status(200).json({ allCategories: categories });
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Error fetching categories" });
    }
});
exports.getAllCategoriesController = getAllCategoriesController;
