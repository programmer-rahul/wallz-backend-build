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
exports.getWallpapersByCategoryController = exports.addBulkWallpapersController = exports.addWallpaperController = void 0;
const cloudinary_1 = require("../config/cloudinary");
const wallpaper_schema_1 = __importDefault(require("../models/wallpaper-schema"));
const redis_1 = require("../config/redis");
const addWallpaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("add wallpaper request");
        const { category } = req.body;
        const wallpaperImage = req.file;
        if (!category || !wallpaperImage) {
            res.status(400).json({ error: "Category and image are required" });
            return;
        }
        const imgUploaded = yield (0, cloudinary_1.uploadToCloudinary)(wallpaperImage.path);
        if (!imgUploaded) {
            res.status(400).json({ error: "Error uploading image to Cloudinary" });
            return;
        }
        const newWallpaper = new wallpaper_schema_1.default({
            id: imgUploaded.public_id,
            category,
            url: imgUploaded.secure_url,
            downloadCount: 0,
            viewCount: 0,
        });
        yield newWallpaper.save();
        // Invalidate relevant Redis caches
        yield redis_1.redisClient.del("categories"); // Clear category cache
        yield redis_1.redisClient.keys(`wallpapers:*`).then((keys) => {
            if (keys.length)
                redis_1.redisClient.del(keys); // Clear all wallpaper-related caches
        });
        res.status(200).json({ message: "Wallpaper added successfully" });
    }
    catch (error) {
        console.error("Error adding wallpaper:", error);
        res.status(500).json({ error: "Failed to add wallpaper" });
    }
});
exports.addWallpaperController = addWallpaperController;
const getWallpapersByCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const favouriteIds = (_a = req.query) === null || _a === void 0 ? void 0 : _a.favouriteIds;
        const cacheKey = `wallpapers:${category}:${page}:${limit}`;
        // Check Redis cache
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
            return;
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        let wallpapers, totalCount;
        if (category === "all-wallpapers") {
            wallpapers = yield wallpaper_schema_1.default.find({}).skip(skip).limit(limit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({});
        }
        else if (category === "favourite" && favouriteIds) {
            const ids = JSON.parse(favouriteIds);
            wallpapers = yield wallpaper_schema_1.default.find({ id: { $in: ids } })
                .skip(skip)
                .limit(limit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({ id: { $in: ids } });
        }
        else {
            wallpapers = yield wallpaper_schema_1.default.find({ category })
                .skip(skip)
                .limit(limit);
            totalCount = yield wallpaper_schema_1.default.countDocuments({ category });
        }
        const totalPages = Math.ceil(totalCount / limit);
        const result = {
            page,
            limit,
            totalPages,
            totalCount,
            wallpapers,
        };
        // Cache result in Redis for 30 minutes
        yield redis_1.redisClient.setEx(cacheKey, 1800, JSON.stringify(result));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching wallpapers:", error);
        res.status(500).json({ error: "Error fetching wallpapers" });
    }
});
exports.getWallpapersByCategoryController = getWallpapersByCategoryController;
const addBulkWallpapersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        const wallpaperImages = req.files;
        if (!category || !(wallpaperImages === null || wallpaperImages === void 0 ? void 0 : wallpaperImages.length)) {
            res.status(400).json({ error: "Category and images are required" });
            return;
        }
        const uploadedWallpapers = [];
        for (const wallpaper of wallpaperImages) {
            const imgUploaded = yield (0, cloudinary_1.uploadToCloudinary)(wallpaper.path);
            if (!imgUploaded)
                continue;
            const newWallpaper = new wallpaper_schema_1.default({
                id: imgUploaded.public_id,
                category,
                url: imgUploaded.secure_url,
                downloadCount: 0,
                viewCount: 0,
            });
            yield newWallpaper.save();
            uploadedWallpapers.push(newWallpaper);
        }
        // Invalidate caches
        yield redis_1.redisClient.del("categories");
        yield redis_1.redisClient.keys(`wallpapers:*`).then((keys) => {
            if (keys.length)
                redis_1.redisClient.del(keys);
        });
        res.status(200).json({
            message: "Wallpapers uploaded successfully",
            uploadedWallpapers,
        });
    }
    catch (error) {
        console.error("Error in bulk upload:", error);
        res.status(500).json({ error: "Failed to upload wallpapers in bulk" });
    }
});
exports.addBulkWallpapersController = addBulkWallpapersController;
