import Parse from "./parse.js";

const Record = Parse.Object.extend("Record");

// Saves a search result ({ id, artist, title, year, cover, thumb, ... }) as a private record of the logged-in user.
export const saveRecord = async (album) => {
  const user = Parse.User.current();
  if (!user) throw new Error("You must be logged in to add a record.");
  const record = new Record();
  record.set("release_code", String(album.id));
  record.set("title", album.title);
  record.set("artist_name", album.artist);
  record.set("release_year", album.year ? Number(album.year) || undefined : undefined);
  record.set("cover", album.cover || album.thumb);
  record.set("owner", user);
  record.setACL(new Parse.ACL(user));
  console.log("Saving record:", record);
  return await record.save();
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
