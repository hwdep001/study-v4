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
      this.dbHelper.selectAllForSub().then(res => {
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

  initWordLevel() {

  }

  deleteWord() {
    this.dbHelper.deleteTables();
  }

  updateWord() {
    this.checkSub();
  }

  checkSub() {
    
    this.subsRef.orderBy("num").get().then(querySnapshop => {

      let pros = new Array<Promise<any>>();

      querySnapshop.forEach(subDs => {
        let result: Promise<any>;
        let sub_: Subject;
        let sub = subDs.data();
        sub.id = subDs.id;

        pros.push(this.dbHelper.selectByIdForSub(sub.id).then(res => {
          if(res.rows.length > 0) {
            sub_ = res.rows.item(0);
          }

          if(sub_ == null) {
            result = this.dbHelper.insertSub(sub);
          } else {
            result = this.dbHelper.updateSub(sub);
          }

          return result.then(any => {
            return this.checkCat(sub.id);
          });
        }));
      });

      Promise.all(pros).then(any => {
        console.log("!!!!!!!! checkSub - [FINISH]");
      });
    });
  }

  checkCat(subId: string): Promise<any> {
    console.log("@@@@@@@@@@ checkCat - " + subId);
    return new Promise( (resolve, reject) => {
      resolve();
    });
  }
}
