import { CommonUtil } from "../utils/commonUtil";

export class User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;

  createDate: string;
  lastDate: string;
  isAuth: boolean;

  isDel: boolean;

  user2ObjectForSet() {
    const date = new Date().yyyy_MM_dd_HH_mm_ss();
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      createDate: date,
      lastDate: date,
      isAuth: false,
      isDel: false
    }
  }

  user2ObjectForUpdate() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      lastDate: new Date().yyyy_MM_dd_HH_mm_ss(),
    }
  }
}