import React, { useContext, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { useQuery } from "@apollo/client";
import { USER_PROFILE } from "../graphql/apiRequests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "native-base";
import { AuthContext } from "../context/context";
const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.MY_LISTING,
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGES,
  },
];

const AccountScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const { loading, error, data } = useQuery(USER_PROFILE);
  const imageLink = { uri: data?.authUserProfile.avatar };
  const { signOut } = useContext(AuthContext);
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          onPress={() => {
            if (
              data?.authUserProfile != null &&
              data?.authUserProfile != undefined
            )
              navigation.navigate(routes.EDIT_PROFILE, data?.authUserProfile);
            else return;
          }}
          title={
            data?.authUserProfile.name ? (
              data.authUserProfile.name
            ) : (
              <Text></Text>
            )
          }
          subTitle={
            data?.authUserProfile.email ? (
              data.authUserProfile.email
            ) : (
              <Text></Text>
            )
          }
          image={imageLink ? imageLink : require("../assets/mosh.jpg")}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={() => signOut()}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
