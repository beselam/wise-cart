import { ApolloClient, InMemoryCache, split, ApolloLink } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const URI = "https://my-cat-server.jelastic.metropolia.fi/graphql";
const URI2 = "ws://my-cat-server.jelastic.metropolia.fi/subscriptions";
const httpLink = new createUploadLink({
  uri: URI,
});
const wsLink = new WebSocketLink({
  uri: URI2,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token || "",
    },
  };
});
const defaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
};
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;

/*

import { ApolloClient, InMemoryCache, split, ApolloLink } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from "subscriptions-transport-ws";

//10.69.1.56
//192.168.1.104
const URI = "http://172.20.10.2:7000/graphQl";
const URI2 = "ws://172.20.10.2:7000/subscriptions";
const httpLink = new createUploadLink({
  uri: URI,
  // Additional options
});
const wsLink = new WebSocketLink({
  uri: URI2,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token || "",
    },
  };
});
const defaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
};
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;

*/
