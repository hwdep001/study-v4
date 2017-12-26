import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { DBHelper } from './../../../providers/db-helper';
import { CommonService } from './../../../providers/common-service';
import { TestService } from './../../../providers/test-service';

import { Word } from './../../../models/Word';
import { WordSearch } from './../../../models/WordSearch';

@Component({
  selector: 'page-ewList',
  templateUrl: 'ew-list.html'
})
export class EwListPage {

  words: Array<Word>;
  ws: WordSearch;
  title: string;

  constructor(
    private param: NavParams,
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

}
