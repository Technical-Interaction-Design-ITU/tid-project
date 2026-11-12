import Parse from "./parse.js";
import { createDefaultRecordLists } from "./recordListServices.js";

// the user who is logged in, or null
export function currentUser() {
  return Parse.User.current();
}

export async function signUp(username, password, email) {
  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password); // Parse hashes this server-side
  if (email) user.set("email", email);
  await user.signUp();

  // others must be able to find me by username, to share with me
  const acl = new Parse.ACL(user);
  acl.setPublicReadAccess(true);
  user.setACL(acl);
  await user.save();

  // Create the two default recordLists: Collection and Want List
  await createDefaultRecordLists();

  return user;
}

export async function logIn(username, password) {
  return Parse.User.logIn(username, password);
}

export async function logOut() {
  await Parse.User.logOut();
}
