import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import useLocation from "../hooks/useLocation";
import { useMutation } from "@apollo/client";
import { CREATE_POST, UPDATE_PICTURE } from "../graphql/apiRequests";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import ActivityIndicator from "../components/ActivityIndicator";
import UploadScreen from "./UploadScreen";
import { Text } from "native-base";

const validationSchema = Yup.object().shape({
  images: Yup.array().max(1).min(1),
});

const reactNativeFileMaker = async (images) => {
  const imageList = [];
  await Promise.all(
    images.map(async (image) => {
      const featuredImage = new ReactNativeFile({
        uri: image,
        name: image.split("/").pop(),
        type: mime.lookup(image) || "image/jpeg",
      });
      imageList.push(featuredImage);
    })
  );
  return imageList;
};

const EditProfileScreen = ({ navigation, route }) => {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [newRequest, setNewRequest] = useState(false);

  const profile = route.params;

  const [updateProfilePic, { loading, error, data }] = useMutation(
    UPDATE_PICTURE,
    {
      onCompleted(pic) {
        if (pic.updateProfilePic != null && pic.updateProfilePic != undefined) {
          setUploadVisible(true);
        }
      },
    }
  );

  const handleSubmit = async (pic) => {
    try {
      const userPic = await reactNativeFileMaker(pic.images);
      updateProfilePic({ variables: { picture: userPic[0] } });
    } catch (e) {}
  };

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }
  return (
    <Screen style={styles.container}>
      {error && <Text>{error?.message}</Text>}
      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
        }}
        visible={uploadVisible}
      />
      <Form
        initialValues={{
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <SubmitButton title="Update" />
      </Form>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default EditProfileScreen;
