import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  user;

  constructor(
    public navCtrl: NavController
  ) {
    this.user = firebase.auth().currentUser;
  }

  signInWithGoogle() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    firebase.auth().signOut();
  }
}
