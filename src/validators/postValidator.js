import * as yup from "yup";

const title = yup
  .string()
  .required("Title of Blog is required.")
  .min(5, "Title of the Blog should have at least 5 characters.")
  .max(50, "Title of the Blog should have at most 50 characters.");

const content = yup
  .string()
  .required("Content of the Blog is required.")
  .min(20, "Content of the Blog should have at least 5 characters.")
  .max(500, "Content of the Blog should have at most 3000 characters.");

export const NewPostRules = yup.object().shape({
  title,
  content,
});
