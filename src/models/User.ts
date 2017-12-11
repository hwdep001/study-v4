export class User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;

  isSignIn: boolean;
  isAuth: boolean;

  user2ObjectForSet() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      isSignIn: false,
      isAuth: false
    }
  }

  user2ObjectForUpdate() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL
    }
  }
}