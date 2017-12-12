import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonUtil } from './../../utils/commonUtil';

import { SigninPage } from './../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //test
  user; // :User

  constructor(
    public navCtrl: NavController
  ) {
    this.user = CommonUtil.fireUser2user(firebase.auth().currentUser);
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
      if(doc.exists) {
        this.user = doc.data();
      }
    })
  }

  clickSignOutBtn() {
    firebase.auth().signOut().then( () => {
      this.navCtrl.setRoot(SigninPage);
    });
  }
}
