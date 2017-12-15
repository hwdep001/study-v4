import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Count } from '../../../models/Count';
import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { Word } from './../../../models/Word';

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
      const loader = this.cmn_.getLoader(null, null);
      loader.present();

      this.dbHelper.selectAllForSub().then(items => {
        let pros = new Array<Promise<any>>();

        this.subs = items;

        for(let i=0; i<this.subs.length; i++) {
          pros.push(this.dbHelper.selectBySubIdForCat(this.subs[i].id).then(cats => {
            this.subs[i].cats = cats;
          }));
        }

        return Promise.all(pros);
      }).then(any => loader.dismiss())
      .catch(err => loader.dismiss());
    ///////////////////////////////////////////////////////////
    } else {
      this.subs = this.test_.selectAllSubs();
      for(let i=0; i<this.subs.length; i++) {
        this.subs[i].cats = this.test_.selectAllCatsBySubId(this.subs[i].id);
      }
    }
  }

  initWordLevel() {
    this.dbHelper.updateAllLevelWord(0).then(any => {
      this.cmn_.Toast.present("bottom", "초기화되었습니다.", null);
    });
  }

  deleteWord() {
    this.dbHelper.deleteTables().then(any => {
      this.getSubject();
    });
  }

  updateWord() {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();
    
    let pros = new Array<Promise<any>>();
    pros.push(this.checkCount());
    pros.push(this.checkLevel());
    pros.push(this.checkSub());

    Promise.all(pros).then(any => {
      loader.dismiss();
      this.getSubject();
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }).catch(err => {
      loader.dismiss();
      this.getSubject();
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! : " + err);
    });
  }

  checkCount(): Promise<any> {
    return this.dbHelper.deleteCount().then(any => {
      return firebase.firestore().collection("counts").doc("counts").get().then(doc => {
        if(doc.exists) {
          
          let data = doc.data();
          let pros = new Array<Promise<any>>();

          for(let i=0; i<data.array.length; i++) {
            pros.push(this.dbHelper.insertCount(new Count(data.array[i])));
          }
  
          return Promise.all(pros);
        }
      });
    }); 
  }

  checkLevel(): Promise<any> {
    return this.dbHelper.deleteLevel().then(any => {
      return firebase.firestore().collection("levels").get().then(querySnapshot => {
        
        let pros = new Array<Promise<any>>();

        querySnapshot.forEach(levDs => {
          let level = levDs.data();
          level.id = levDs.id;
          pros.push(this.dbHelper.insertLevel(level));
        });

        return Promise.all(pros);
      });
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

        pros.push(this.dbHelper.selectByIdForSub(sub.id).then(item => {
          sub_ = item;

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

      return Promise.all(pros);
    });
  }

  checkCat(subId: string): Promise<any> {

    return this.subsRef.doc(subId).collection("cats").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Category>();

      pros3.push(this.dbHelper.selectBySubIdForCat(subId).then(items => {

        let pros = new Array<Promise<any>>();

        for(let i=0; i<items.length; i++) {
          map.set(items[i].id, items[i]);
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

          return Promise.all(pros2);
        });
      }));

      return Promise.all(pros3);
    });
  }

  checkLec(catDs: firebase.firestore.DocumentSnapshot, cat: Category): Promise<any> {
    
    return catDs.ref.collection("lecs").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Lecture>();

      pros3.push(this.dbHelper.selectByCatIdForLec(cat.id).then(items => {

        let pros = new Array<Promise<any>>();

        for(let i=0; i<items.length; i++) {
          map.set(items[i].id, items[i]);
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

          return Promise.all(pros2);
        });
      }));

      return Promise.all(pros3);
    });
  }

  checkWord(lecDs: firebase.firestore.DocumentSnapshot, cat: Category, lec: Lecture): Promise<any> {
    
    return lecDs.ref.collection("words").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Word>();

      pros3.push(this.dbHelper.selectByLecIdForWord(cat.id).then(items => {

        let pros = new Array<Promise<any>>();

        for(let i=0; i<items.length; i++) {
          map.set(items[i].id, items[i]);
        }

        querySnapshot.forEach(wordDs => {
          let result: Promise<any>;
          let word = wordDs.data();
          word.id = wordDs.id;
          word.lectureId = lec.id;
          let word_: Word = map.get(word.id);

          // insert
          if(word_ == null) {
            result = this.dbHelper.insertWord(word);
          } else {
            map.delete(word.id);
          }

          // update
          if(word_ != null && !Word.equals(word, word_)) {
            result = this.dbHelper.updateWithOutLevelWord(word);
          }

          if(result == null) {
            console.log("LECTURE ......: " + lec.name);
          } else {
            pros.push(result);
          }
        });

        return Promise.all(pros).then(any => {
          let pros2 = new Array<Promise<any>>();

          map.forEach((word: Word, id: string) => {
            pros2.push(this.dbHelper.deleteByIdForWord(id));
          });

          return Promise.all(pros2)
          .then(any => {

            // lecture, cat version update
            return this.dbHelper.updateLec(lec).then(any => {
              return this.dbHelper.updateCat(cat);
            });
          }).catch(err => {
            return new Promise(re => re());
          });
        });
      }));

      return Promise.all(pros3);
    });
  }
}
