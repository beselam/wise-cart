import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { Button, Fab, Input, Item, Right } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { Ionicons } from "@expo/vector-icons";
import routes from "../navigation/routes";

import {
  Container,
  Header,
  View,
  DeckSwiper,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
  Icon,
} from "native-base";
import AppButton from "../components/Button";
import AppText from "../components/Text";
import { USER_PROFILE, GET_ROOM, CREATE_ROOM } from "../graphql/apiRequests";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "../context/userContext";
import ActivityIndicator from "../components/ActivityIndicator";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
function ListingDetailsScreen({ route, navigation }) {
  const listing = route.params;
  const { user } = useContext(UserContext);
  const [room, setRoom] = useState(null);
  const { error: err, data, refetch } = useQuery(
    GET_ROOM,

    {
      variables: {
        postId: listing.id,
        usersId: [user._id, listing.author._id],
      },
    },
    { fetch: "network-only" }
  );
  const [createRoom, { data: newRoom, loading }] = useMutation(CREATE_ROOM);

  console.log(data);
  useEffect(() => {
    refetch();
  }, []);

  const ll = [];
  const images = listing.featuredImage;
  images.forEach((element) => {
    let link = { uri: element };
    ll.push(link);
  });
  const profile = { uri: listing.author.avatar };

  if (
    newRoom?.createRoom?.id !== null &&
    newRoom?.createRoom?.id !== undefined &&
    room == null
  ) {
    console.log(newRoom.createRoom);
    setRoom(newRoom.createRoom.id);
    navigation.navigate(routes.CHAT_SCREEN, {
      post: listing.id,
      user: user,
      receiver: listing.author._id,
      roomId: newRoom.createRoom.id,
    });
  }

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{ marginVertical: 0, flex: 1 }}>
      <View style={{ display: "flex", flex: 1 }}>
        <Container>
          <View>
            <DeckSwiper
              dataSource={ll}
              renderItem={(item) => (
                <Card style={{ elevation: 2 }}>
                  <CardItem cardBody>
                    <Image
                      style={{ height: 250, flex: 1, resizeMode: "contain" }}
                      source={item}
                    />
                  </CardItem>
                  <CardItem>
                    <Left>
                      <AppText style={{ fontSize: 28 }}>
                        {listing.title}
                      </AppText>
                    </Left>

                    <Text style={{ paddingLeft: 10, color: colors.secondary }}>
                      €{listing.price}
                    </Text>
                  </CardItem>
                </Card>
              )}
            />
          </View>
        </Container>
      </View>
      <View
        style={{
          display: "flex",
          flex: 1.4,
          width: "100%",
          alignSelf: "center",
          flexDirection: "column",
        }}
      >
        <Card transparent>
          <CardItem>
            <Left>
              <Thumbnail source={profile} />
              <Body>
                <AppText style={{ fontSize: 20 }}>
                  {listing.author.name}
                </AppText>
                <AppText style={{ fontSize: 14 }}>seller</AppText>
              </Body>
            </Left>
            <Right>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(routes.COMMENT_SCREEN, {
                    postId: listing.id,
                    userId: user?._id,
                  })
                }
                style={{
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  paddingLeft: 30,
                }}
              >
                <MaterialIcons
                  name="comment"
                  size={24}
                  color={colors.primary}
                />
                <Text style={{ fontSize: 12 }}>comment</Text>
              </TouchableOpacity>
            </Right>
            <Right>
              {listing?.author?._id != user?._id && (
                <Button
                  transparent
                  style={{ width: 50, height: 50 }}
                  onPress={() => {
                    if (
                      data.singleRoom?.id !== null &&
                      data.singleRoom?.id !== undefined
                    ) {
                      navigation.navigate(routes.CHAT_SCREEN, {
                        post: listing.id,
                        user: user,
                        receiver: listing.author._id,
                        roomId: data?.singleRoom?.id || false,
                      });
                    } else {
                      createRoom({
                        variables: {
                          postId: listing.id,
                          users: [user._id, listing.author._id],
                        },
                      });
                    }
                  }}
                >
                  <View>
                    <FontAwesome
                      name="wechat"
                      size={24}
                      color={colors.secondary}
                      style={{ alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: 12 }}>message</Text>
                  </View>
                </Button>
              )}
            </Right>
          </CardItem>
        </Card>
        <View style={{ width: "90%", alignSelf: "center" }}>
          <AppText style={{ fontSize: 26 }}>Description</AppText>
          <AppText style={{ color: colors.medium }}>
            {listing.description}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default ListingDetailsScreen;
