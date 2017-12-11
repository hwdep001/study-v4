import { CommonUtil } from './../../utils/commonUtil';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { User } from '../../models/User';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  user: User;

  constructor(
    public navCtrl: NavController,
  ) {
    this.user = CommonUtil.fireUser2user(firebase.auth().currentUser);
  }

  signOut() {
    firebase.auth().signOut();
  }

}
