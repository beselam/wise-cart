import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyListingScreen from "../screens/MyListingScreen";
import UserListingEditScreen from "../screens/UserListingEditScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import UserChatDetailScreen from "../screens/UserChatDetailScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="MyListings" component={MyListingScreen} />
    <Stack.Screen name="UserListingEdit" component={UserListingEditScreen} />
    <Stack.Screen name="UpdateProfilePic" component={EditProfileScreen} />
    <Stack.Screen name="ChatDetail" component={UserChatDetailScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;
