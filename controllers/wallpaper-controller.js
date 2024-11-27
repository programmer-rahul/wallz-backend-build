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
exports.getWallpapersByCategoryController = exports.addWallpaperController = void 0;
const cloudinary_1 = require("../config/cloudinary");
const wallpaper_schema_1 = __importDefault(require("../models/wallpaper-schema"));
const addWallpaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wallpaperName, category } = req.body;
        const wallpaperImage = req.file;
        // console.log("wallpaperName", wallpaperName);
        // console.log("category", category);
        // console.log("wallpaperImage", wallpaperImage);
        if (!wallpaperName || !category) {
            return;
        }
        // Check if the file exists
        if (!wallpaperImage) {
            res.status(400).json({ error: "Wallpaper image is required" });
            return;
        }
        const imgUploaded = yield (0, cloudinary_1.uploadToCloudinary)(wallpaperImage.path);
        console.log(imgUploaded);
        if (!imgUploaded) {
            res.status(400).json({ error: "Cloudinary image uploading error" });
            return;
        }
        const newWallpaper = new wallpaper_schema_1.default({
            id: imgUploaded.public_id,
            wallpaperName,
            category,
            url: imgUploaded.secure_url,
        });
        if (!newWallpaper) {
            res
                .status(400)
                .json({ error: "Error during creating new wallpaper model" });
            return;
        }
        yield newWallpaper.save();
        res.status(200).json({ message: "Wallpaper added successfully" });
    }
    catch (error) {
        console.log("erro", error);
        res.status(500).json({ error: "Failed to add wallpaper" });
    }
});
exports.addWallpaperController = addWallpaperController;
const getWallpapersByCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get category from request parameters
        console.log('request');
        const { category } = req.params;
        // Get page and limit from query parameters
        let page = req.query.page; // Treat page as string
        let limit = req.query.limit; // Treat limit as string
        let favouriteIds = (_a = req.query) === null || _a === void 0 ? void 0 : _a.favouriteIds; // Treat limit as string
        // Set defaults for pagination if not provided
        page = page ? page : "1"; // Default to page 1 if undefined
        limit = limit ? limit : "10"; // Default to 10 wallpapers per page if undefined
        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Ensure that the parsed values are valid numbers, otherwise fallback to defaults
        const validPage = pageNumber > 0 ? pageNumber : 1;
        const validLimit = limitNumber > 0 ? limitNumber : 10;
        // Calculate how many wallpapers to skip
        const skip = (validPage - 1) * validLimit;
        // Find wallpapers by category with pagination
        let wallpapers;
        let totalCount;
        if (category === "all-wallpapers") {
            wallpapers = yield wallpaper_schema_1.default.find({}).skip(skip).limit(validLimit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({});
        }
        else if (category === "favourite" && favouriteIds) {
            const ids = JSON.parse(favouriteIds);
            wallpapers = yield wallpaper_schema_1.default.find({ id: { $in: ids } })
                .skip(skip)
                .limit(validLimit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({ id: { $in: ids } });
        }
        else {
            wallpapers = yield wallpaper_schema_1.default.find({ category })
                .skip(skip)
                .limit(validLimit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({ category });
        }
        // Get the total count of wallpapers in the category
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / validLimit);
        // Return the results with pagination info
        res.status(200).json({
            page: validPage,
            limit: validLimit,
            totalPages,
            totalCount,
            wallpapers,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching wallpapers" });
    }
});
exports.getWallpapersByCategoryController = getWallpapersByCategoryController;
