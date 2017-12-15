import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';

import { User } from './../../../models/User';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  user: User;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService
  ) {
    this.user = cmn_.user;
  }

  signOut() {
    firebase.auth().signOut();
  }

}
