import { ApolloServer } from "apollo-server-express";
import express from "express";
import connectMongo from "./db/db.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import AuthMiddleware from "./middleware/auth.js";
import { schemaDirectives } from "./graphql/directives/index.js";

import { createServer } from "http";

(async () => {
  try {
    const connect = await connectMongo();
    if (connect) {
      console.log("connected succesfully");
    }
    const app = express();

    app.use(express.json());
    app.use(AuthMiddleware);

    app.use("/src/uploads", express.static("./src/uploads"));
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,

      context: ({ req, connection }) => {
        if (connection) {
          console.log("conn");
          return {
            connection,
          };
        }
        let { isAuth, user } = req;

        return {
          req,
          isAuth,
          user,
        };
      },
    });

    server.applyMiddleware({ app, AuthMiddleware });
    const ws = createServer(app);

    server.installSubscriptionHandlers(ws);

    ws.listen({ port: 7000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:7000${server.graphqlPath}`
      )
    );
  } catch (e) {
    console.log("server error: " + e.message);
  }
})();
