import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';

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
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.checkSub().then(any => {
      loader.dismiss();
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }).catch(err => {
      loader.dismiss();
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! : " + err);
    });
  }

  checkSub(): Promise<any> {
    return this.subsRef.orderBy("num").get().then(querySnapshop => {

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

      return Promise.all(pros).then(any => {
        return new Promise<any>(re => re());
      }).catch(err => {
        return new Promise<any>(re => re());
      });
    });
  }

  checkCat(subId: string): Promise<any> {

    return this.subsRef.doc(subId).collection("cats").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Category>();

      pros3.push(this.dbHelper.selectBySubIdForCat(subId).then(res => {

        let pros = new Array<Promise<any>>();

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

          if(result == null) {
            console.log("CATEGORY ......: " + cat.name);
            if(lecCheckFlag) {
              result = new Promise<any>(re => re());
            }
          }

          if(lecCheckFlag) {
            pros.push(result.then(any => {
              return this.checkLec(catDs, cat);
            }));
          }
        });

        return Promise.all(pros).then(any => {
          let pros2 = new Array<Promise<any>>();

          map.forEach((cat: Category, id: string) => {
            pros2.push(this.dbHelper.deleteByIdForCat(id));
          });

          return Promise.all(pros2)
          .then(any => {
            return new Promise(re => re());
          }).catch(err => {
            return new Promise(re => re());
          });
        });
      }));

      return Promise.all(pros3).then(any => {
        return new Promise(re => re());
      }).catch(err => {
        return new Promise(re => re());
      });

    });
  }

  checkLec(catDs: firebase.firestore.DocumentSnapshot, cat: Category): Promise<any> {
    
    return catDs.ref.collection("lecs").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Lecture>();

      pros3.push(this.dbHelper.selectByCatIdForLec(cat.id).then(res => {

        let pros = new Array<Promise<any>>();

        for(let i=0; i<res.rows.length; i++) {
          const lec = res.rows.item(i);
          map.set(lec.id, lec);
        }

        querySnapshot.forEach(lecDs => {
          let result: Promise<any>;
          let wordCheckFlag = false;
          let lec = lecDs.data();
          lec.id = lecDs.id;
          lec.categoryId = cat.id;
          let lec_: Lecture = map.get(lec.id);

          // insert
          if(lec_ == null) {
            wordCheckFlag = true;
            result = this.dbHelper.insertWithOutVersionLec(lec);
          } else {
            map.delete(lec.id);
          }

          // update
          if(lec_ != null) {
            if(lec.version != lec_.version) {
              wordCheckFlag = true;
            }

            if(!Lecture.equals(lec, lec_)) {
              result = this.dbHelper.updateWithOutVersionLec(lec);
            }
          }

          if(result == null) {
            console.log("LECTURE ......: " + lec.name);
            if(wordCheckFlag) {
              result = new Promise<any>(re => re());
            }
          }

          if(wordCheckFlag) {
            pros.push(result.then(any => {
              return this.checkWord(lecDs, cat, lec);
            }));
          }
        });

        return Promise.all(pros).then(any => {
          let pros2 = new Array<Promise<any>>();

          map.forEach((lec: Lecture, id: string) => {
            pros2.push(this.dbHelper.deleteByIdForLec(id));
          });

          return Promise.all(pros2)
          .then(any => {
            return new Promise(re => re());
          }).catch(err => {
            return new Promise(re => re());
          });
        });
      }));

      return Promise.all(pros3).then(any => {
        return new Promise(re => re());
      }).catch(err => {
        return new Promise(re => re());
      });
      
    });
  }

  checkWord(lecDs: firebase.firestore.DocumentSnapshot, cat: Category, lec: Lecture): Promise<any> {
    return new Promise(re => re());
  }
}
