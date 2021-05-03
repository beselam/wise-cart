import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GET_ALL_POST,
  GET_POST_BY_CATEGORY,
  GET_POST_BY_LOCATION,
  USER_PROFILE,
} from "../graphql/apiRequests";
import Slider from "@react-native-community/slider";
import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { useQuery, gql, useLazyQuery, useSubscription } from "@apollo/client";
import ActivityIndicator from "../components/ActivityIndicator";
import { FontAwesome } from "@expo/vector-icons";
import {
  Header,
  Item,
  Picker,
  Icon,
  Card as Ncard,
  Image,
  CardItem,
  Button,
} from "native-base";
import { UserContext } from "../context/userContext";
import { FormPicker, Form, SubmitButton } from "../components/forms";
import useLocation from "../hooks/useLocation";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FilterSubmitButton from "../components/forms/FilterSubmitButton";

function ListingsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [category, setCategory] = useState(false);
  const [sliderValue, setSliderValue] = useState(null);
  const [filterByLocation, setFilterByLocation] = useState(false);
  const location = useLocation();
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_POST,
    { fetch: "network-only" },
    {
      onCompleted({ data }) {
        setPosts(data.getAllPosts);
      },
    }
  );
  const [
    getPostByLocation,
    { data: locData, error: locError, loading: locLoading },
  ] = useLazyQuery(GET_POST_BY_LOCATION, { fetch: "network-only" });

  const [
    getPostsByCategory,
    { loading: categoryLoading, error: categoryError, data: categoryData },
  ] = useLazyQuery(
    GET_POST_BY_CATEGORY,
    { fetch: "network-only" },

    {
      onCompleted(categoryData) {
        setPosts(categoryData.getPostByCategory);
      },
    }
  );

  useEffect(() => {
    if (data?.getAllPosts && !category) {
      setPosts(data.getAllPosts);
    }
  }, [data]);

  useEffect(() => {
    if (category && categoryData?.getPostByCategory && !categoryLoading) {
      setPosts(categoryData.getPostByCategory);
      setCategory(false);
    }
  }, [categoryData]);

  const onRefresh = async () => {
    refetch();
    setPosts(data.getAllPosts);
  };

  const handleFilter = async (item) => {
    const category = item.postCategory;
    if (category != null && category != undefined) {
      getPostsByCategory({ variables: { category: category.label } });
      setCategory(true);
    }
  };

  useEffect(() => {
    if (locData?.getPostByLocation && filterByLocation) {
      setPosts(locData.getPostByLocation);
      setFilterByLocation(false);
    }
  }, [locData]);

  const handleSliderChange = (value) => {
    setSliderValue(Math.round(value));
    if (location) {
      const maxDistance = sliderValue * 1000;
      getPostByLocation({
        variables: {
          long: location.longitude,
          lat: location.latitude,
          maxDistance,
        },
      });
    } else {
      Alert.alert(
        //title
        "Hello",
        //body
        "The has no permission to access you location, please go to your phone setting and give location permission for this app",
        [
          {
            text: "Ok",
            onPress: () => console.log("Yes Pressed"),
          },
        ],
        { cancelable: true }
        //clicking out side of alert will not cancel
      );
    }
  };

  const locationButtonHandler = () => {
    setFilterByLocation(!filterByLocation);
  };
  const handleSlider = (value) => {
    setSliderValue(Math.round(value));
  };

  if (loading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <Screen style={{ paddingHorizontal: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Form
          initialValues={{
            postCategory: null,
          }}
          onSubmit={handleFilter}
        >
          <FormPicker
            items={categories}
            name="postCategory"
            numberOfColumns={3}
            PickerItemComponent={CategoryPickerItem}
            placeholder="Category"
            width="58%"
          />
          <Button
            onPress={locationButtonHandler}
            style={{
              alignSelf: "center",
              width: 50,
              marginHorizontal: 5,
              marginStart: 15,
              height: 55,
              backgroundColor: colors.light,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome
              name="location-arrow"
              size={24}
              color={filterByLocation ? colors.primary : "black"}
            />
          </Button>
          <FilterSubmitButton style={{ width: 20 }} />
        </Form>
      </View>
      <View
        style={{
          marginVertical: 5,
          justifyContent: "center",
          alignSelf: "center",
          width: "100%",
          display: filterByLocation ? "flex" : "none",
        }}
      >
        <Text style={{ alignSelf: "center", color: colors.medium }}>
          Search Listing by distance
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Slider
            style={{ width: 200, height: 50 }}
            minimumValue={1}
            maximumValue={500}
            inverted={false}
            value={200}
            onValueChange={handleSlider}
            onSlidingComplete={handleSliderChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#000000"
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",

              width: 100,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.secondary,
                marginRight: 3,
              }}
            >
              {sliderValue}
            </Text>
            <Text>Km</Text>
          </View>
        </View>
      </View>

      {posts != undefined && posts != null && posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(data) => data.id.toString()}
          numColumns={2}
          scrollToOverflowEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={"€" + item.price}
              image={item.featuredImage[0]}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ncard
            style={{
              height: 100,
              elevation: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 25,
                color: colors.primary,
              }}
            >
              no post
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 14,
                color: colors.primary,
              }}
            >
              pull to refresh
            </Text>
          </Ncard>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;
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
