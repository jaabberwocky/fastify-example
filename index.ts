import Fastify, { FastifyRequest } from "fastify";
require('dotenv').config();
import { User } from "./types/user.interface";
import { BodyType, ParamType } from "./types/request.interface";
import { generateUsers } from "./utils/generateUsers";
import { v4 as uuidv4 } from "uuid";

const fastify = Fastify({
  logger: true,
});

console.log(`Env:${process.env.NODE_ENV}`)
const PORT: number = parseInt(process.env.PORT);
let data: User[] = generateUsers();

fastify.register(
  function (fastify, _, done) {
    fastify.get("/users", function (request, reply) {
      reply.send(JSON.stringify(data));
    });
    fastify.get(
      "/users/:id",
      async function (request: FastifyRequest<{ Params: ParamType }>, reply) {
        const id = request.params.id;
        const index = data.map((e) => e.id).indexOf(id);

        if (index > -1) {
          reply.status(200).send(JSON.stringify(data[index]));
        } else {
          reply.status(404).send();
        }
      }
    );
    fastify.put(
      "/users/:id",
      function (
        request: FastifyRequest<{ Params: ParamType; Body: BodyType }>,
        reply
      ) {
        const id = request.params.id;
        const newName = request.body.userName;

        data.forEach((entry) => {
          if (entry.id === id) {
            entry.userName = newName;
            reply.status(204).send();
          }
        });
        reply.status(404).send();
      }
    );
    fastify.post(
      "/users",
      function (request: FastifyRequest<{ Body: BodyType }>, reply) {
        const newUser = {
          id: uuidv4(),
          userName: request.body.userName,
        };
        data.push(newUser);
        reply.status(201).send(newUser);
      }
    );
    fastify.delete(
      "/users/:id",
      function (request: FastifyRequest<{ Params: ParamType }>, reply) {
        const id = request.params.id;
        const index = data.map((e) => e.id).indexOf(id);
        if (index > -1) {
          // result is found
          data.splice(index, 1);
          reply.status(204).send();
        } else {
          reply.status(404).send();
        }
      }
    );
    done();
  },
  { prefix: "/api/v1" }
);

fastify.listen(
  {
    port: PORT,
  },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Listening on ${address}...`);
  }
);
