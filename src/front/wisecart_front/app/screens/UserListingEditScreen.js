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
import { UPDATE_POST, DELETE_POST } from "../graphql/apiRequests";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import ActivityIndicator from "../components/ActivityIndicator";
import UploadScreen from "./UploadScreen";
import AppButton from "../components/Button";
import colors from "../config/colors";

const fillInputs = (updateListing, listing) => {
  if (updateListing.title === "") {
    updateListing.title = listing.title;
  }
  if (updateListing.price === "") {
    updateListing.price = listing.price;
  }
  if (updateListing.description === "") {
    updateListing.description = listing.description;
  }
  if (updateListing.postCategory !== "") {
    updateListing.category = updateListing.postCategory.label;
  }
  if (updateListing.postCategory === "") {
    updateListing.category = listing.category;
  }
  return updateListing;
};
const UserListingEditScreen = ({ navigation, route }) => {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [newRequest, setNewRequest] = useState(false);
  const listing = route.params;
  const [updatePost, { error, loading, data }] = useMutation(UPDATE_POST);
  const [
    deletePost,
    { data: deleteData, error: DeleteError, loading: DeleteLoading },
  ] = useMutation(DELETE_POST);

  if (data?.updatePost && !uploadVisible && newRequest) {
    setUploadVisible(true);
    setNewRequest(false);
  }

  if (deleteData?.deletePost && !uploadVisible && newRequest) {
    setUploadVisible(true);
    setNewRequest(false);
  }

  const handleSubmit = async (updateListing) => {
    updateListing.id = listing.id;
    const newListing = fillInputs(updateListing, listing);
    try {
      setNewRequest(true);
      const { id, title, price, description, category } = await newListing;

      await updatePost({
        variables: { id, title, description, category, price },
      });
    } catch (e) {}
  };

  const handleDelete = async () => {
    try {
      const id = listing.id;
      setNewRequest(true);
      deletePost({
        variables: { id },
      });
      console.log(deleteData);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading || DeleteLoading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
          navigation.goBack();
        }}
        visible={uploadVisible}
      />
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          postCategory: "",
          images: [],
        }}
        onSubmit={handleSubmit}
      >
        <FormField maxLength={255} name="title" placeholder={listing.title} />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder={listing.price}
          width={120}
        />
        <Picker
          items={categories}
          name="postCategory"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder={listing.category}
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder={listing.description}
        />
        <SubmitButton title="Update" color="secondary" />
        <AppButton title="delete" onPress={handleDelete} />
      </Form>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
let categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
    label: "Furniture",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Cars",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "camera",
    label: "Cameras",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "cards",
    label: "Games",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-heel",
    label: "Clothing",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "basketball",
    label: "Sports",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-variant",
    label: "Books",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 9,
  },
];

export default UserListingEditScreen;
