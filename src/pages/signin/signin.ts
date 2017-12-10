import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { HomePage } from './../home/home';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  constructor(
    public navCtrl: NavController
  ) {
  }

  signInWithGoogle() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    firebase.auth().signOut();
  }
}
