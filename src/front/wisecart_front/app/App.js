import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import navigationTheme from "./navigation/navigationTheme";
import AppNavigator from "./navigation/AppNavigator";
import { ApolloProvider } from "@apollo/client";

import RegisterScreen from "./screens/RegisterScreen";
import client from "./graphql/apolloClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthNavigator from "./navigation/AuthNavigator";
import ActivityIndicator from "./components/ActivityIndicator";
import { AuthContext } from "./context/context";
import { UserContext } from "./context/userContext";
import { LocationContext } from "./context/locationContext";
export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  const checkUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const value = await AsyncStorage.getItem("user");

    if (token && value) {
      const userData = await JSON.parse(value);
      setUser(userData);
      setUserAuthenticated(true);
      setLoading(false);
    } else {
      setUserAuthenticated(false);
      setLoading(false);
    }
  };
  const authContext = useMemo(
    () => ({
      signIn: async (userToken, currentUser) => {
        setLoading(true);
        const token = await AsyncStorage.setItem("token", userToken);
        const use = await AsyncStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
        setUser(currentUser);
        setUserAuthenticated(true);

        setLoading(false);
      },
      signUp: async (userToken, currentUser) => {
        setToken(userToken, currentUser);
        setLoading(true);
        const token = await AsyncStorage.setItem("token", userToken);
        setUser(currentUser);
        setUserAuthenticated(true);
        setLoading(false);
      },
      signOut: async () => {
        setLoading(true);
        await AsyncStorage.removeItem("token");
        setUser(null);
        setUserAuthenticated(false);
        setLoading(false);
      },
    }),
    []
  );

  useEffect(() => {
    checkUser();
  }, []);

  if (isLoading) {
    return <ActivityIndicator visible={isLoading} />;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <UserContext.Provider value={{ user, setUser }}>
        <LocationContext.Provider value={{ userLocation, setUserLocation }}>
          <NavigationContainer theme={navigationTheme}>
            <ApolloProvider client={client}>
              {userAuthenticated ? <AppNavigator /> : <AuthNavigator />}
            </ApolloProvider>
          </NavigationContainer>
        </LocationContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}
