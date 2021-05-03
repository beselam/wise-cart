import React, { useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { useQuery } from "@apollo/client";
import { USER_POSTS } from "../graphql/apiRequests";
import ActivityIndicator from "../components/ActivityIndicator";
import Card from "../components/Card";
import routes from "../navigation/routes";
import ListingCard from "../components/ListingCard";

const initialMessages = [
  {
    id: 1,
    title: "Mosh Hamedani",
    description: "Hey! Is this item still available?",
    image: require("../assets/mosh.jpg"),
  },
  {
    id: 2,
    title: "Mosh Hamedani",
    description:
      "I'm interested in this item. When will you be able to post it?",
    image: require("../assets/mosh.jpg"),
  },
];

const MyListingScreen = ({ navigation }) => {
  const { loading, error, data } = useQuery(
    USER_POSTS,
    { pollInterval: 2000 },
    { fetch: "network-only" }
  );

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }
  return (
    <Screen style={styles.screen}>
      {data?.getUserPosts.length > 0 && data?.getUserPosts !== undefined ? (
        <FlatList
          data={data.getUserPosts}
          keyExtractor={(data) => data.id.toString()}
          renderItem={({ item }) => (
            <ListingCard
              title={item.title}
              subTitle={"€" + item.price}
              image={item.featuredImage[0]}
              onPress={() => navigation.navigate(routes.EDIT_LISTING, item)}
            />
          )}
        />
      ) : (
        <Text style={{ alignSelf: "center", color: colors.medium }}>
          you have no Listing
        </Text>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default MyListingScreen;
