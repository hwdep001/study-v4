import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Subject } from './../../../models/Subject';

@Component({
  selector: 'page-wordMng',
  templateUrl: 'word-mng.html'
})
export class WordMngPage {

  private isCordova: boolean;

  private subsRef: firebase.firestore.CollectionReference;
  private subs: Array<Subject>;
  private user;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.isCordova = dbHelper.isCordova;

    this.subsRef = firebase.firestore().collection("subs");
    this.user = cmn_.user;
    this.getSubject();

    // const loader = this.cmn_.getLoader(null, null);
    // loader.present();
  }

  getSubject() {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectAllSubs().then(res => {
        console.log(res);
      });
    ///////////////////////////////////////////////////////////
    } else {
      this.subs = this.test_.selectAllSubs();
      for(let i=0; i<this.subs.length; i++) {
        this.subs[i].cats = this.test_.selectAllCatsBySubId(this.subs[i].id);
      }
      console.log(this.subs);
    }
  }

  updateWord() {
    // this.subsRef.orderBy("num").get().then(querySnapshot => {
    //   querySnapshot.forEach(doc => {
        
    //   });
    // });
  }

  initWordLevel() {

  }

  deleteWord() {
    this.dbHelper.dropTables();
  }
}
