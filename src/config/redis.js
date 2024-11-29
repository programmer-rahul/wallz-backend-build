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
exports.connectRedis = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redisClient;
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.redisClient = redisClient = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
        console.log("Redis connected successfully");
        // redis connection events
        redisClient.on("ready", () => {
            console.log("Redis client is ready");
        });
        redisClient.on("error", (err) => {
            console.error("Redis client error:", err);
        });
        redisClient.on("end", () => {
            console.log("Redis connection closed");
        });
        redisClient.on("error", (err) => console.error("Redis Client Error", err));
    }
    catch (error) {
        console.error("Error connecting to Redis:", error);
    }
});
exports.connectRedis = connectRedis;
