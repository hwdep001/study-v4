import { CommonUtil } from './../../utils/commonUtil';
import { User } from './../../models/User';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { SigninPage } from './../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //test
  user: User;

  constructor(
    public navCtrl: NavController,
  ) {
    this.user = CommonUtil.fireUser2user(firebase.auth().currentUser);
  }

  clickSignOutBtn() {
    firebase.auth().signOut().then( () => {
      this.navCtrl.setRoot(SigninPage);
    });
  }

}
