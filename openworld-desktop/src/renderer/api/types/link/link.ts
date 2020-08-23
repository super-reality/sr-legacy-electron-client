export default interface Link {
  _id: string;
  type: "subject" | "lesson" | "user" | "project" | "organization";
}
