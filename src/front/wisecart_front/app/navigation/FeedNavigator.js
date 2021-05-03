import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ChatScreen from "../screens/ChatScreen";
import CommentScreen from "../screens/CommentScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator mode="modal" screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Listings" component={ListingsScreen} />
    <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
    <Stack.Screen name="chatScreen" component={ChatScreen} />
    <Stack.Screen name="CommentScreen" component={CommentScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
