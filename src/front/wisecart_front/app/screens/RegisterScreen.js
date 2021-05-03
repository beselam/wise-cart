import React, { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import { gql, useMutation } from "@apollo/client";
import ActivityIndicator from "../components/ActivityIndicator";
import { REGISTER_USER } from "../graphql/apiRequests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/context";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("username"),
  email: Yup.string().required().email().label("email"),
  password: Yup.string().required().min(4).label("password"),
});

function RegisterScreen() {
  const [registerUser, { data, error, loading }] = useMutation(REGISTER_USER);
  const { signUp } = useContext(AuthContext);

  useEffect(() => {
    if (data?.registerUser) {
      signUp(data.registerUser.token, data.registerUser.user);
    }
  }, [data]);

  const handleSubmit = async ({ name, email, password }) => {
    try {
      await registerUser({
        variables: {
          name,
          email,
          password,
        },
      });
    } catch (e) {}
  };
  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  return (
    <Screen style={styles.container}>
      <Text>{error && error.message}</Text>
      <Form
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="username"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Register" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
