import { Thumbnail } from "native-base";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import colors from "../config/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COMMENT, GET_COMMENT } from "../graphql/apiRequests";

const CommentScreen = ({ navigation, route }) => {
  const { postId, userId } = route.params;
  const [commentList, setCommentList] = useState(null);
  const [newCommentCreated, setNewCommentCreated] = useState(false);
  const [message, setMessage] = useState("");
  const { data, error, loading } = useQuery(GET_COMMENT, {
    variables: { postId },
  });
  const [
    createComment,
    { data: newComment, error: commentError },
  ] = useMutation(CREATE_COMMENT);

  useEffect(() => {
    if (data?.comment != undefined && data?.comment != null) {
      setCommentList(data.comment);
    }
  }, [data]);

  const imager = (image) => {
    return { uri: image };
  };

  const handleCreateComment = (value) => {
    createComment({ variables: { postId: postId, text: message } });
    setMessage("");
    setNewCommentCreated(true);
  };

  if (newCommentCreated && newComment?.createComment != undefined) {
    setCommentList((comment) => [...comment, newComment.createComment]);
    setNewCommentCreated(false);
  }

  const dateFormatter = (date) => {
    console.log(date);
    const dt = new Date(parseInt(date)).toLocaleDateString();
    console.log(dt);
    return dt;
  };

  return (
    <View style={{ flex: 1 }}>
      {commentList != null &&
      commentList != undefined &&
      commentList.length > 0 ? (
        <FlatList
          data={commentList}
          keyExtractor={(comment) => {
            // console.log(comment.user);
            return comment.id;
          }}
          renderItem={({ item }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <Thumbnail
                source={imager(item.user.avatar)}
                style={{ marginTop: 10 }}
              />
              <View style={{ padding: 10, width: "70%" }}>
                <Text style={{ fontWeight: "700" }}>{item.user.name}</Text>
                <Text>{item.text}</Text>

                <Text
                  style={{
                    alignSelf: "flex-end",
                    fontSize: 12,
                    color: colors.medium,
                  }}
                >
                  {dateFormatter(item.createdAt)}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        ></View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={{ width: "100%" }}
      >
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            <FontAwesome5 name="laugh-beam" size={24} color="grey" />
            <TextInput
              placeholder={"Type a comment ...."}
              style={styles.textInput}
              multiline
              maxLength={200}
              value={message}
              onChangeText={setMessage}
            />
          </View>
          {message ? (
            <TouchableOpacity onPress={() => handleCreateComment()}>
              <View style={styles.buttonContainer}>
                <MaterialIcons name="send" size={20} color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <View style={styles.buttonContainer}>
                <FontAwesome name="commenting" size={20} color="white" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-end",
  },
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommentScreen;

/* 
<KeyboardAvoidingView
        enabled={true}
        behavior="padding"
        style={{ marginBottom: 30, height: 40 }}
        keyboardVerticalOffset={100}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            flexDirection: "row",
            borderTopWidth: 1,
            borderColor: "#EEE",
            alignItems: "center",
            paddingLeft: 15,
          }}
        >
          <TextInput
            placeholder="Add comment ... "
            keyboardType="twitter"
            autoFocus={true}
            style={{ flex: 1, height: 40, fontSize: 15, marginBottom: 30 }}
          ></TextInput>
        </View>
      </KeyboardAvoidingView> */
