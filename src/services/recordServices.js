import Parse from "parse";

const Record = Parse.Object.extend("Record");

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
