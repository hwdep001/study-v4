import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';

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
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

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
        loader.dismiss();
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }).catch(err => {
        loader.dismiss();
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! : " + err);
      });
    });
  }

  checkCat(subId: string): Promise<any> {
    console.log("@@@@@@@@@@ checkCat - " + subId);

    return this.subsRef.doc(subId).collection("cats").orderBy("num").get().then(querySnapshot => {

      let map = new Map<string, Category>();

      this.dbHelper.selectBySubIdForCat(subId).then(res => {
        for(let i=0; i<res.rows.length; i++) {
          const cat = res.rows.item(i);
          map.set(cat.id, cat);
        }

        querySnapshot.forEach(catDs => {
          let result: Promise<any>;
          let lecCheckFlag = false;
          let cat = catDs.data();
          cat.id = catDs.id;
          cat.subjectId = subId;
          let cat_: Category = map.get(cat.id);

          // insert
          if(cat_ == null) {
            lecCheckFlag = true;
            result = this.dbHelper.insertWithOutVersionCat(cat);
          } else {
            map.delete(cat.id);
          }

          // update
          if(cat_ != null) {
            if(cat.version != cat_.version) {
              lecCheckFlag = true;
            }

            if(!Category.equals(cat, cat_)) {
              result = this.dbHelper.updateWithOutVersionCat(cat);
            }
          }

          if(lecCheckFlag && result != null) {
            result.then(any => {
              this.checkLec(catDs, cat);
            });
          }
        });

        map.forEach((cat: Category, id: string) => {
          this.dbHelper.deleteByIdForCat(id);
        });
      });

      
    });
  }

  checkLec(catDs: firebase.firestore.DocumentSnapshot, cat: Category) {
    console.log("[test]-checkLec CAT: " + cat.name);
  }
}
