import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonUtil } from './../../utils/commonUtil';

import { User } from '../../models/User';

import { WordMngPage } from './word-mng/word-mng';

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

  moveWordMng() {
    this.navCtrl.push(WordMngPage, {
      activeName: CommonUtil.getActiveName("setting")});
  }

  signOut() {
    firebase.auth().signOut();
  }

}
