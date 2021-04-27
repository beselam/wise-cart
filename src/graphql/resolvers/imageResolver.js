import { createWriteStream, mkdir } from "fs";
import shortid from "shortid";

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  let path = `src/uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  path = `http://localhost:7000/${path}`;
  return { filename, id, mimetype, path };
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

export default {
  Query: {
    info: () => "image finder",
  },

  Mutation: {
    imageUploader: async (_, { file }) => {
      const upload = await processUpload(file);
      return upload;
    },
  },
};


