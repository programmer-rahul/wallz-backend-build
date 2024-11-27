"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wallpaperSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true },
    id: { type: String, required: true },
}, { timestamps: true });
wallpaperSchema.index({ category: 1 });
const WallpaperModel = mongoose_1.default.model("Wallpaper", wallpaperSchema);
exports.default = WallpaperModel;
