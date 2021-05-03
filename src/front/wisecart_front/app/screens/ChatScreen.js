import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";

import {
  CREATE_MESSAGE,
  SUBSCRIBE_FOR_NEW_MESSAGE,
  GET_MESSAGES,
} from "../graphql/apiRequests";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState(null);

  const info = route.params;
  console.log(info);

  const { data: oldMessages, error: err, refetch } = useQuery(
    GET_MESSAGES,
    {
      variables: { id: info.roomId },
    },
    { fetch: "network-only" }
  );

  const { data, error, loading } = useSubscription(
    SUBSCRIBE_FOR_NEW_MESSAGE,
    {
      variables: {
        roomId: info.roomId,
        postId: info.post,
      },
    },
    { fetch: "network-only" }
  );

  useEffect(() => {
    let newMessage = data?.newSubscriptionMessage || false;

    if (newMessage) {
      setMessages((arr) => [newMessage, ...arr]);
    }
  }, [data]);

  useEffect(() => {
    refetch();
    if (oldMessages?.message != undefined && oldMessages?.message != null) {
      const message = oldMessages.message;

      setMessages(message);
    } else {
    }
  }, [oldMessages]);

  const [createMessage, { data: messageNew }] = useMutation(CREATE_MESSAGE);

  const onSend = async (ms) => {
    const { text } = ms[0];
    const receiver = info.receiver;
    const user = info.user._id;
    const postId = info.post;
    const roomId = info.roomId;

    createMessage({
      variables: { postId, roomId, user, receiver, text },
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: info.user._id,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ChatScreen;
