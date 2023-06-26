import { child, ref, getDatabase, onValue, set } from "firebase/database";

import { app } from "./firebase";

function getEmailMapRef(email: string) {
  const db = ref(getDatabase(app));
  return child(db, `email_to_id/${email.replace(".", ",")}`);
}

export function getUserIdFromEmail(email: string): Promise<string | undefined> {
  if (!email) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    onValue(
      getEmailMapRef(email.toLowerCase()),
      (snapshot) => {
        resolve(snapshot.val());
      },
      { onlyOnce: true }
    );
  });
}

export const setEmailMap = (userId: string, email: string) => {
  return set(getEmailMapRef(email.toLowerCase()), userId);
};
