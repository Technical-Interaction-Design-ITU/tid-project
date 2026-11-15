import Parse from "./parse.js";
import { addToRecordList } from "./recordListServices.js";
import { testRecords } from "../data/testRecords.js";

const Record = Parse.Object.extend("Record");

// Create a new Record and link it to a recordList via Stored_in
// recordData: { releaseCode, title, artistName }
// recordList can be collection or wantList
export const newRecord = async (recordData, recordList) => {
  const user = Parse.User.current();
  if (!user) throw new Error("Must be logged in to create a record");
  const acl = new Parse.ACL(user);

  // (new records always start in the collection or the want list, never a crate)
  const type = recordList?.get("type");
  if (type !== "collection" && type !== "wantList") {
    throw new Error(
      `New records must go in a collection or wantList, got "${type}"`,
    );
  }

  // Create the new record object
  const record = new Record();
  record.set("release_code", String(recordData.releaseCode)); // releaseCode is a String
  record.set("title", recordData.title);
  record.set("artist_name", recordData.artistName);
  record.setACL(acl);
  await record.save();

  // add it to recordList
  try {
    await addToRecordList(record.id, recordList.get("list_id"));
  } catch (err) {
    // Delete record if not in a list
    await record.destroy();
    throw err;
  }
  return record;
};

// Add all test records to the given recordList
// (newRecord only accepts a collection or wantList)
export const addTestRecords = async (recordList) => {
  return await Promise.all(
    testRecords.map((recordData) => newRecord(recordData, recordList)),
  );
};
