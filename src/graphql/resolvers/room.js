import { ApolloError } from "apollo-server-errors";
import Room from "../../models/Room.js";

export default {
  Query: {
    room: async (_, { id }) => {
      try {
        const room = await Room.find({ users: id }).populate("user");
        return room;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    singleRoom: async (_, { postId, usersId }) => {
      try {
        const room = await Room.findOne({
          users: { $all: usersId },
          postId: postId,
        });

        return room;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createRoom: async (_, { newRoom }) => {
      const room = new Room({ ...newRoom });
      const result = await room.save();
      return result;
    },
  },
};
