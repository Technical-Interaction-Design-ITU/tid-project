import Parse from "./parse.js";

const RecordList = Parse.Object.extend("Record_List");
const StoredIn = Parse.Object.extend("Stored_in");

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

// Get all crates owned by the logged in user
export const getCrates = async () => {
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to read record lists");

  return await new Parse.Query(RecordList)
    .equalTo("user_id", user.id)
    .equalTo("type", "crate")
    .find();
};

// Get the logged in user's collection or wantList (each user has exactly one of each)
export const getDefaultList = async (type) => {
  if (type !== "collection" && type !== "wantList") {
    throw new Error(`"${type}" is not a default list type`);
  }
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to read record lists");

  const list = await new Parse.Query(RecordList)
    .equalTo("user_id", user.id)
    .equalTo("type", type)
    .first();
  if (!list) throw new Error(`No ${type} found for user ${user.id}`);
  return list;
};

// Link a record to a list by creating a Stored_in row
// recordId is the Record's objectId, recordListId is the list's list_id
export const addToRecordList = async (recordId, recordListId) => {
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to add to a record list");

  const link = new StoredIn();
  link.set("record_id", recordId);
  link.set("record_list_id", recordListId);
  link.setACL(new Parse.ACL(user));
  return await link.save();
};

// Get all records in a list, by looking them up in the Stored_in join table
// listId is the list's list_id, record_id is the Record's objectId
export const getRecordsInList = async (listId) => {
  const links = await new Parse.Query("Stored_in")
    .equalTo("record_list_id", listId)
    .find();
  const recordIds = links.map((link) => link.get("record_id"));
  if (recordIds.length === 0) return [];

  return await new Parse.Query("Record")
    .containedIn("objectId", recordIds)
    .find();
};

// Create collection and wantList for new sign up
export const createDefaultRecordLists = async () => {
  return await Promise.all([
    createRecordList("Collection", "collection"),
    createRecordList("WantList", "wantList"),
  ]);
};
