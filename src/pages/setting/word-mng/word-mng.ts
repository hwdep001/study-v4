import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

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

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.isCordova = dbHelper.isCordova;
    this.subsRef = firebase.firestore().collection("subs");
    this.initData().then(any => loader.dismiss()).catch(err => loader.dismiss());
  }

  private initData(): Promise<any> {

    let pros = new Array<Promise<any>>();
    if(this.dbHelper.isCordova) {
      pros.push(this.checkCount());
      pros.push(this.checkLevel());
      pros.push(this.checkSub().then(any => {
        pros.push(this.setSubs());
      }));
    } else {
      this.subs = this.test_.selectAllSubs();
      for(let i=0; i<this.subs.length; i++) {
        this.subs[i].cats = this.test_.selectAllCatsBySubId(this.subs[i].id);
      }
    }

    return Promise.all(pros);
  }

  private checkCount(): Promise<any> {
    return this.dbHelper.selectAllForCount().then(items => {

      if(items.length != 10) {
        return this.dbHelper.deleteCount().then(any => {

          return this.dbHelper.initDefaultDataCount();
        }); 
      }
    });
  }

  private checkLevel(): Promise<any> {
    return this.dbHelper.selectAllForLevel().then(items => {

      if(items.length != 5) {
        return this.dbHelper.deleteLevel().then(any => {

          return this.dbHelper.initDefaultDataLevel();
        });
      }
    });
  }

  private checkSub(): Promise<any> {
    return this.dbHelper.selectAllForSub().then(items => {
      
      if(items.length != 7) {
        return this.dbHelper.deleteSub().then(any => {

          return this.dbHelper.initDefaultDataSub();
        });
      }
    });
  }

  private setSubs(): Promise<any> {
    return this.dbHelper.selectAllForCat().then(cats => {

      let subs = new Array<Subject>();
      let sub: Subject;
      let preSubId;

      for(let i=0; i<cats.length; i++) {
        const cat = cats[i];
        let subId = cat.subjectId;

        if(i != 0 && preSubId != subId) {
          subs.push(sub);
        }

        if(preSubId != subId) {
          sub = new Subject();
          sub.id = cat.subjectId;
          sub.name = cat.subjectName;
          sub.cats = new Array<Category>();
        }
        
        sub.cats.push(cat);

        if(i >= cats.length-1) {
          subs.push(sub);
        }
        
        preSubId = subId;
      }

      this.subs = subs;
    });
  }

  initWordLevel() {
    this.cmn_.Alert.confirm("모든 단어의 레벨을 초기화하시겠습니까?").then(any => {

      const loader = this.cmn_.getLoader(null, null);
      loader.present();
  
      this.dbHelper.updateAllLevelWord(0).then(any => {
        loader.dismiss();
        this.cmn_.Toast.present("bottom", "초기화되었습니다.", null);
      }).catch(err => loader.dismiss());
    }).catch(err => {});
  }

  deleteWord() {
    this.cmn_.Alert.confirm("모든 단어 및 데이터를 삭제하시겠습니까?").then(any => {
      const loader = this.cmn_.getLoader(null, null);
      loader.present();
  
      this.dbHelper.deleteTables().then(any => {
        return this.initData().then(any => {
          return firebase.firestore().collection("users").doc(this.cmn_.uid).update({isDel: false});
        })
      }).then(any => {
        loader.dismiss();
        this.cmn_.setIsDel(false);
        this.cmn_.Toast.present("bottom", "삭제하였습니다.", null);
      }).catch(err => loader.dismiss());
    }).catch(err => {});
  }

  dropTables() {
    this.cmn_.Alert.confirm("Do you want to drop the database?").then(any => {
      const loader = this.cmn_.getLoader(null, null);
      loader.present();

      this.dbHelper.dropTables().then(any => {
        return firebase.firestore().collection("users").doc(this.cmn_.uid).update({isDel: false});
      }).then(any => {
        loader.dismiss();
        this.cmn_.Toast.present("bottom", "Successfully deleted database.", null);
        window.location.reload();
      })
    }).catch(err => {});
  }


  checkCat(subId: string) {
    const loader = this.cmn_.getLoader(null, null, 90000);
    loader.present();

    let pro = this.subsRef.doc(subId).collection("cats").orderBy("num").get().then(querySnapshot => {

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

    pro.then(any => {
      this.initData().then(any => loader.dismiss()).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }
    
  private checkLec(catDs: firebase.firestore.DocumentSnapshot, cat: Category): Promise<any> {
    
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

  private checkWord(lecDs: firebase.firestore.DocumentSnapshot, cat: Category, lec: Lecture): Promise<any> {
    
    return lecDs.ref.collection("words").orderBy("num").get().then(querySnapshot => {

      let pros3 = new Array<Promise<any>>();
      let map = new Map<string, Word>();

      pros3.push(this.dbHelper.selectByLecIdForWord(lec.id).then(items => {

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
