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

/* let url = "https://localjost:7000";
      let { filename, createReadStream } = await file;
      const stream = createReadStream();
      let { ext, name } = path.parse(filename);
      name = name.replace(/([^a-z0-9 ]+)/gi, "_").replace(" ", "_");
      console.log("name", name);
      const __dirname = path.dirname(new URL(import.meta.url).pathname);
      let serverFile = path.join(__dirname, `../../uploads/${name}${ext}`);
      console.log("serverbefore", serverFile);
      let writeStream = await createWriteStream(serverFile);
      await stream.pipe(writeStream);
      serverFile = `${url}${serverFile.split("uploads")[1]}`;
      console.log("serverF", serverFile);
      return {
        url: serverFile,
      }; */
