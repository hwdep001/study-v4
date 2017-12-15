import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  user;
  userListener: any

  constructor(
    public navCtrl: NavController
  ) {
    
  }

  ionViewDidEnter() {
    this.user = firebase.auth().currentUser;
    if(this.user != null) {
      this.userListener = firebase.firestore().collection("users").doc(this.user.uid).onSnapshot(doc => {
        if(doc && doc.exists) {
          const snapshotUser = doc.data();
          if(snapshotUser.isAuth == true) {
            window.location.reload();
          }
        }
      });
    }
  }
  
  ionViewWillLeave() {
    if(this.userListener != null) {
      this.userListener.unsubscribe();
    }
  }

  signInWithGoogle() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    firebase.auth().signOut();
  }
}
