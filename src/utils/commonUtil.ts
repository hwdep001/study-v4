import { User } from './../models/User';
import * as firebase from 'firebase/app';

export class CommonUtil {

    public static fireUser2user(fireUser: firebase.User) {
        let user = null;

        if(fireUser != null) {
            user = new User();
            user.uid = fireUser.uid;
            user.email = fireUser.email;
            user.displayName = fireUser.displayName;
            user.photoURL = fireUser.photoURL;
        }

        return user;
    }
}