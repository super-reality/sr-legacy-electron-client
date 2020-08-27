export default interface Link {
  _id: string;
  type:
    | "collection"
    | "subject"
    | "lesson"
    | "user"
    | "project"
    | "organization";
}
