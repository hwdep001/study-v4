export class User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;

  isSignIn: boolean;
  isAuth: boolean;

  user2Object() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      isSignIn: this.isSignIn,
      isAuth: this.isAuth
    }
  }
}