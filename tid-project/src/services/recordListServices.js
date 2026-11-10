import Parse from "./parse.js";

const RecordList = Parse.Object.extend("Record_List");

export const LIST_TYPES = ["collection", "wantList", "crate"];

// Create and save a new list owned by the logged in user
// ACL: only the owner can read/write it
export const createRecordList = async (name, type) => {
  if (!LIST_TYPES.includes(type)) {
    throw new Error(
      `Invalid list type "${type}", expected one of: ${LIST_TYPES.join(", ")}`,
    );
  }
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to create a record list");

  const list = new RecordList();
  list.set("list_id", crypto.randomUUID());
  list.set("user_id", user.id);
  list.set("list_name", name);
  list.set("created_at", new Date());
  list.set("type", type);
  list.setACL(new Parse.ACL(user));
  return await list.save();
};

// Create collection and wantList for new sign up
export const createDefaultRecordLists = async () => {
  return await Promise.all([
    createRecordList("Collection", "collection"),
    createRecordList("Want List", "wantList"),
  ]);
};
