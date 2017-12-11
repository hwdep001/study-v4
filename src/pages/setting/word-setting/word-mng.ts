import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { UserService } from '../../../providers/user-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Subject } from './../../../models/Subject';

@Component({
  selector: 'page-wordMng',
  templateUrl: 'word-mng.html'
})
export class WordMngPage {

  private isCordova: boolean;
  private subs: Array<Subject>;
  user;

  constructor(
    public navCtrl: NavController,
    private user_: UserService,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.isCordova = dbHelper.isCordova;
    this.user = user_.user;
    this.getSubject();
  }

  getSubject() {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectAllSubs().then();
    } else {
      this.subs = this.test_.selectAllSubs();
      for(let i=0; i<this.subs.length; i++) {
        this.subs[i].cats = this.test_.selectAllCatsBySubId(this.subs[i].id);
      }
      console.log(this.subs);
    }
  }
}
