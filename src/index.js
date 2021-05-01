"use-strict";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import connectMongo from "./db/db.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import AuthMiddleware from "./middleware/auth.js";
import { schemaDirectives } from "./graphql/directives/index.js";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import { PORT } from "./config/index.js";
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

    /* ws.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    ); */
    process.env.NODE_ENV = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV === "production") {
      production(ws, 7000);
    } else {
      localhost(ws, 7700, 7000);
    }
  } catch (e) {
    console.log("server error: " + e.message);
  }
})();
