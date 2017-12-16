import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  user;
  unsubscribe: any

  constructor(
    public navCtrl: NavController
  ) {
    
  }

  ionViewDidEnter() {
    this.user = firebase.auth().currentUser;
    if(this.user != null) {
      this.unsubscribe = firebase.firestore().collection("users").doc(this.user.uid).onSnapshot(doc => {
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
    if(this.unsubscribe != null) {
      this.unsubscribe();
    }
  }

  signInWithGoogle() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    firebase.auth().signOut();
  }
}
