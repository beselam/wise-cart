import { ApolloError } from "apollo-server-errors";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import {
  issueAuthToken,
  serializeUser,
} from "../../utilities/authentication.js";
import {
  UserAuthenticationRules,
  UserRegistrationRules,
} from "../../validators/userValidation.js";

export default {
  Query: {
    getUsers: async () => {
      const users = User.find();
      return users;
    },
    authUserProfile: async (_, args, { user }) => {
      return {
        username: user.username,
        id: user.id,
        email: user.email,
      };
    },
    loginUser: async (_, { email, password }) => {
      console.log("hhhhh");
      try {
        await UserAuthenticationRules.validate(
          { email, password },
          { abortEarly: false }
        );
        let user = await User.findOne({ email });
        if (!user) {
          throw new Error("user not found");
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid user");
        }
        user = user.toObject();
        user.id = user._id;
        user = await serializeUser(user);

        let token = await issueAuthToken(user);
        return {
          token,
          user: user,
        };
      } catch (e) {
        throw new ApolloError(e.message, 403);
      }
    },
  },

  Mutation: {
    registerUser: async (_, { newUser }) => {
      try {
        let { email, username, password } = newUser;
        console.log(newUser);
        await UserRegistrationRules.validate(
          { username, password, email },
          { abortEarly: false }
        );

        let user = await User.findOne({ username });

        if (user) {
          throw new Error("Username is already taken.", "403");
        }
        user = await User.findOne({ email });
        if (user) {
          throw new Error("Email is already registered.", "403");
        }

        user = new User(newUser);

        user.password = await bcrypt.hash(user.password, 10);

        let result = await user.save();

        result = result.toObject();

        result.id = result._id;

        result = serializeUser(result);

        let token = await issueAuthToken(result);
        console.log(token);
        return {
          token,
          user: result,
        };
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
