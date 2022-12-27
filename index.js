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
const fastify_1 = __importDefault(require("fastify"));
require('dotenv').config();
const generateUsers_1 = require("./utils/generateUsers");
const uuid_1 = require("uuid");
const fastify = (0, fastify_1.default)({
    logger: true,
});
console.log(`Env:${process.env.NODE_ENV}`);
const PORT = parseInt(process.env.PORT);
let data = (0, generateUsers_1.generateUsers)();
fastify.register(function (fastify, _, done) {
    fastify.get("/users", function (request, reply) {
        reply.send(JSON.stringify(data));
    });
    fastify.get("/users/:id", function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const index = data.map((e) => e.id).indexOf(id);
            if (index > -1) {
                reply.status(200).send(JSON.stringify(data[index]));
            }
            else {
                reply.status(404).send();
            }
        });
    });
    fastify.put("/users/:id", function (request, reply) {
        const id = request.params.id;
        const newName = request.body.userName;
        data.forEach((entry) => {
            if (entry.id === id) {
                entry.userName = newName;
                reply.status(204).send();
            }
        });
        reply.status(404).send();
    });
    fastify.post("/users", function (request, reply) {
        const newUser = {
            id: (0, uuid_1.v4)(),
            userName: request.body.userName,
        };
        data.push(newUser);
        reply.status(201).send(newUser);
    });
    fastify.delete("/users/:id", function (request, reply) {
        const id = request.params.id;
        const index = data.map((e) => e.id).indexOf(id);
        if (index > -1) {
            // result is found
            data.splice(index, 1);
            reply.status(204).send();
        }
        else {
            reply.status(404).send();
        }
    });
    done();
}, { prefix: "/api/v1" });
fastify.listen({
    port: PORT,
}, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Listening on ${address}...`);
});
