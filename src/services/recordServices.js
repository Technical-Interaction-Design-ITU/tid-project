import Parse from "./parse.js";
import { getDefaultList, addToRecordList } from "./recordListServices.js";

const Record = Parse.Object.extend("Record");

// Create a new Record and link it to the user's collection via Stored_in
// recordData: { releaseCode, title, artistName }
export const newRecord = async (recordData) => {
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to create a record");
  const acl = new Parse.ACL(user);

  const collection = await getDefaultList("collection");

  // Create the new record object
  const record = new Record();
  record.set("release_code", recordData.releaseCode);
  record.set("title", recordData.title);
  record.set("artist_name", recordData.artistName);
  record.setACL(acl);
  await record.save();

  // add it to the collection recordList
  try {
    await addToRecordList(record.id, collection.get("list_id"));
  } catch (err) {
    // don't leave an orphaned record that isn't in any list
    await record.destroy();
    throw err;
  }

  return record;
};

export const addRecordToList = async (recordData, list) => {
  const record = new Record();
  record.set("releaseCode", recordData.releaseCode);
  record.set("title", recordData.title);
  record.set("artistName", recordData.artistName);
  record.set("label", recordData.label);
  record.set("genre", recordData.genre);
  record.set("list", list); // pointer: the list object itself, not its id
  record.setACL(list.getACL()); // the record follows its list's permissions
  return await record.save();
};
