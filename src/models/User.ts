export class User {
  uid: string;
  email: string;
  name: string;
  photoURL: string;

  isSignIn: boolean;
  isAuth: boolean;

  isAvailable() {
    let result: boolean = false;
    this.isSignIn && this.isAuth ? result = true : result = false;
    return result;
  }
}