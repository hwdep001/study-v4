import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';

import { DBHelper } from './../../../providers/db-helper';
import { CommonUtil } from './../../../utils/commonUtil';
import { CommonService } from './../../../providers/common-service';
import { TestService } from './../../../providers/test-service';

import { Word } from './../../../models/Word';
import { WordSearch } from './../../../models/WordSearch';
import { RequestPage } from './../request/request';

@Component({
  selector: 'page-c4List',
  templateUrl: 'c4-list.html'
})
export class C4ListPage {

  words: Array<Word>;
  ws: WordSearch;
  title: string;
  queFlag: boolean = false;

  constructor(
    private param: NavParams,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private dbHelper: DBHelper,
    private cmn_: CommonService,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.ws = this.param.get("wordSearch");

    this.setTitle();
    this.getWords();
  }

  setTitle(): void {
    if(this.ws.isRandom) {
      this.title = this.ws.cat.name;
    } else {
      this.title = this.ws.lec.name;
    }
  }

  getWords(): void {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    let pro: Promise<any>;
    let words: Array<Word>;

    if(this.dbHelper.isCordova) {
      pro = this.dbHelper.selectBySearchForWord(this.ws.lecIds, 
          this.ws.levIds, this.ws.count, this.ws.isRandom).then(items => {

            words = items;
      });
    } else {
      words = this.test_.selectAllWordByLecId(this.ws.lecIds);
      pro = new Promise(re => re());
    }

    pro.then(any => {
      for(let i=0; i<words.length; i++) {
        words[i].flag1 = false;
      }
      this.words = words;
      loader.dismiss();
    }).catch(err => {
      loader.dismiss();
    });
  }

  clickThumbs(word: Word, thumbCode: number): void {
    const level: number = thumbCode + (word.levelId == undefined ? 0 : word.levelId);

    if(level > 2 || level < -2){
      return;
    } else {
      this.dbHelper.updateLevelWord(word.id, level).then(any => {
        word.levelId = level;
      });
    }
  }

  requestModification(word: Word): void {
    const params = {
      activeName: CommonUtil.getActiveName(this.ws.sub.id), 
      subId: this.ws.sub.id,
      catId: this.ws.cat.id,
      word: word
    }

    this.navCtrl.push(RequestPage, params);
  }

  settingQue(): void {
    this.presentRadioAlert(null, "Question Type", this.queFlag).then(data => {
      this.queFlag = data;
    });
  }

  private presentRadioAlert(message: string, title: string, defaultValue: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let radio = this.alertCtrl.create({
        title: title,
        message: message,
        inputs: [
          {
            type: 'radio',
            label: '한자',
            value: 'false',
            checked: defaultValue ? false : true
          },
          {
            type: 'radio',
            label: '한자 + 음',
            value: 'true',
            checked: defaultValue ? true : false
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject();
            }
          },
          {
            text: 'Select',
            handler: data => {
              resolve(data == "true" ? true: false);
            }
          }
        ]
      });
      radio.present();
    });
  }

}
