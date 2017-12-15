import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonUtil } from './../../utils/commonUtil';
import { CommonService } from '../../providers/common-service';

import { SigninPage } from './../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //test
  user;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService
  ) {
    this.user = cmn_.user;
  }

  //test
  clickSignOutBtn() {
    firebase.auth().signOut().then( () => {
      this.navCtrl.setRoot(SigninPage);
    });
  }
}
