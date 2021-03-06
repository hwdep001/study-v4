import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { DBHelper } from './../../../providers/db-helper';
import { CommonUtil } from './../../../utils/commonUtil';
import { CommonService } from './../../../providers/common-service';
import { TestService } from './../../../providers/test-service';

import { Word } from './../../../models/Word';
import { WordSearch } from './../../../models/WordSearch';
import { RequestPage } from './../request/request';

@Component({
  selector: 'page-spsllwList',
  templateUrl: 'spsllw-list.html'
})
export class SpsllwListPage {

  words: Array<Word>;
  ws: WordSearch;
  title: string;

  constructor(
    private param: NavParams,
    private navCtrl: NavController,
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
      let ox: Array<string>;
      for(let i=0; i<words.length; i++) {
        words[i].flag1 = false;
        const word = words[i];
        word.me5 = (word.me4 == "1") ? word.me1 : word.me2;
        ox = [word.me1, word.me2];
        ox.shuffleArray();
        word.me1 = ox[0];
        word.me2 = ox[1];
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

  clickAnswer(seletedanswer: string, word: Word): void {
    word.me6 = (seletedanswer == word.me5) ? "an-t" : "an-f";
    word.flag1 = true;
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

}
