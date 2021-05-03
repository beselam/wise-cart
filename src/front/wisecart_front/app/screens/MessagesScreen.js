import React, { useState, useEffect, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_ROOM, USER_CHAT_ROOMS } from "../graphql/apiRequests";
import { Text } from "native-base";
import { UserContext } from "../context/userContext";
import navigationTheme from "../navigation/navigationTheme";
import routes from "../navigation/routes";
import ActivityIndicator from "../components/ActivityIndicator";

function MessagesScreen({ navigation }) {
  const [rooms, setRooms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [itemDeleted, setItemDeleted] = useState(false);
  const { data, loading, error, refetch } = useQuery(USER_CHAT_ROOMS);

  const [deleteRoom, { data: roomD, loading: deleteLoading }] = useMutation(
    DELETE_ROOM
  );

  const { user } = useContext(UserContext);
  const handleDelete = (message) => {
    deleteRoom({ variables: { roomId: message.id } });
    setItemDeleted(true);
  };
  const userFilter = async (chatRooms) => {
    let list = [];
    await Promise.all(
      chatRooms.map(async (room) => {
        let chatUser = room.users.filter((xx) => xx._id != user._id);
        let newRoom = { ...room };
        newRoom.user = chatUser[0];
        newRoom.thisUser = user._id;
        // newRoom.user.avatar = { uri: newRoom.user.avatar };
        list.push(newRoom);
      })
    );
    setRooms(list);
  };
  const imager = (image) => {
    return { uri: image };
  };

  if (roomD?.deleteRoom && itemDeleted) {
    refetch();
    setItemDeleted(false);
  }

  useEffect(() => {
    if (data?.userRoomList !== null && data?.userRoomList !== undefined) {
      // setRooms(data.userRoomList)
      userFilter(data.userRoomList);
    }
  }, [data]);

  if (loading || deleteLoading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <Screen>
      {rooms !== null && rooms.length > 0 ? (
        <FlatList
          data={rooms}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={item?.user?.name}
              subTitle={item?.postId?.title}
              image={imager(item?.user?.avatar)}
              onPress={() => navigation.navigate(routes.CHAT_DETAIL, item)}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            setMessages([
              {
                id: 2,
                title: "T2",
                description: "D2",
                image: require("../assets/mosh.jpg"),
              },
            ]);
          }}
        />
      ) : (
        <Text>No Message</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
