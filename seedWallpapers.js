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
const mongoose_1 = __importDefault(require("mongoose"));
const wallpaper_schema_1 = __importDefault(require("./src/models/wallpaper-schema")); // Adjust the path if needed
// Connect to MongoDB
const mongoUri = process.env.MONGODB_URL;
mongoose_1.default
    .connect(mongoUri, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Define two static image URLs
const imageUrls = [
    "https://res.cloudinary.com/dubmozsyq/image/upload/v1732549461/m1xuy1aolrc6b5bd5pzx.jpg",
    "https://res.cloudinary.com/dubmozsyq/image/upload/v1732550569/reukbmqapdzuc7fgnmzo.jpg",
];
// Define categories
const categories = [
    "Nature",
    "Architecture",
    "Animals",
    "Abstract",
    "Space",
    "Technology",
    "Art",
];
// Function to generate sample wallpapers
const generateSampleWallpapers = () => {
    const wallpapers = [];
    categories.forEach((category) => {
        console.log(`Generating wallpapers for category: ${category}`); // For debugging
        for (let i = 0; i < 20; i++) {
            wallpapers.push({
                name: `${category}_${i + 1}`,
                url: imageUrls[i % 2], // Alternate between the two URLs
                category,
                id: `${category}_${i + 1}`, // Unique ID for each wallpaper
            });
        }
    });
    return wallpapers;
};
// Function to seed the database
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove any existing wallpapers to start fresh
        yield wallpaper_schema_1.default.deleteMany({});
        // Generate and insert the sample wallpapers
        const sampleWallpapers = generateSampleWallpapers();
        console.log("Inserting wallpapers into database...");
        yield wallpaper_schema_1.default.insertMany(sampleWallpapers);
        console.log("Database seeded with sample wallpapers");
        mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error("Error seeding database:", error);
        mongoose_1.default.disconnect();
    }
});
seedDatabase();
