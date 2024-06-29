import { ref, onValue, push } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {firebaseConfig} from "./firebase";

const database = firebaseConfig

export const readWords = async (setWords) => {
  return onValue(ref(database, "/words"), (snapshot) => {
    const data = [];

    snapshot.forEach((childSnapshot) => {
      data.push(childSnapshot.val());
    });

    setWords(data);
  });
};

export const writeWord = (word) => {
  return push(ref(database, "/words"), {
    id: uuidv4(),
    word,
  });
};
