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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesController = void 0;
const ALLCategories = [
    {
        name: "Nature",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732549461/m1xuy1aolrc6b5bd5pzx.jpg",
    },
    {
        name: "Architecture",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732550569/reukbmqapdzuc7fgnmzo.jpg",
    },
    {
        name: "Abstract",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732549461/m1xuy1aolrc6b5bd5pzx.jpg",
    },
    {
        name: "Space",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732550569/reukbmqapdzuc7fgnmzo.jpg",
    },
    {
        name: "Technology",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732549461/m1xuy1aolrc6b5bd5pzx.jpg",
    },
    {
        name: "Art",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732550569/reukbmqapdzuc7fgnmzo.jpg",
    },
    {
        name: "Animals",
        previewUrl: "https://res.cloudinary.com/dubmozsyq/image/upload/v1732549461/m1xuy1aolrc6b5bd5pzx.jpg",
    },
];
const getAllCategoriesController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Return the results with pagination info
        res.status(200).json({
            allCategories: ALLCategories,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching categories" });
    }
});
exports.getAllCategoriesController = getAllCategoriesController;
