"use strict";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import connectMongo from "./db/db.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import AuthMiddleware from "./middleware/auth.js";
import { schemaDirectives } from "./graphql/directives/index.js";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import localhost from "./security/localhost.js";
import production from "./security/production.js";

(async () => {
  try {
    const connect = await connectMongo();
    if (connect) {
      console.log("connected succesfully");
    }
    const app = express();

    app.use(express.json());
    app.use(AuthMiddleware);
    const pubsub = new PubSub();
    app.use("/src/uploads", express.static("./src/uploads"));
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      subscriptions: {
        path: "/subscriptions",
        onConnect: (connectionParams, webSocket, context) => {
          console.log("Connected!");
        },
        onDisconnect: (webSocket, context) => {
          console.log("Disconnected!");
        },
      },
      context: ({ req, connection }) => {
        if (connection) {
          console.log("conn");
          return {
            connection,
            pubsub,
          };
        }
        let { isAuth, user } = req;

        return {
          req,
          isAuth,
          user,
          pubsub,
        };
      },
    });

    server.applyMiddleware({ app, AuthMiddleware });
    const ws = createServer(app);

    server.installSubscriptionHandlers(ws);

     process.env.NODE_ENV = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV === "production") {
      production(app, 8800, server);
    } else {
      localhost(app, 8000, 8800, server);
    } 
  } catch (e) {
    console.log("server error: " + e.message);
  }
})();
