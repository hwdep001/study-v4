import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { DBHelper } from './../../../providers/db-helper';
import { CommonService } from './../../../providers/common-service';
import { TestService } from './../../../providers/test-service';

import { Word } from './../../../models/Word';
import { WordSearch } from './../../../models/WordSearch';

@Component({
  selector: 'page-krList',
  templateUrl: 'kr-list.html'
})
export class KrListPage {

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
        words[i].flag2 = false;

        words[i].syn = this.createMeString(words[i]);
        words[i].ant = this.createExString(words[i]);
      }
      this.words = words;
      loader.dismiss();
    }).catch(err => {
      loader.dismiss();
    });
  }

  private createMeString(word: Word): string {
    let result: string = null;

    (word.que == null) ? null : (result = word.que);
    (word.me1 == null) ? null : (result += "\n" + word.me1);
    (word.me2 == null) ? null : (result += "\n" + word.me2);
    (word.me3 == null) ? null : (result += "\n" + word.me3);
    (word.me4 == null) ? null : (result += "\n" + word.me4);
    (word.me5 == null) ? null : (result += "\n" + word.me5);
    (word.me6 == null) ? null : (result += "\n" + word.me6);

    return result;
  }

  private createExString(word: Word): string {
    let result: string = null;

    (word.me8  == null) ? null : (result = word.me8);
    (word.me9  == null) ? null : (result += "\n" + word.me9);
    (word.me10 == null) ? null : (result += "\n" + word.me10);
    (word.me11 == null) ? null : (result += "\n" + word.me11);
    (word.me12 == null) ? null : (result += "\n" + word.me12);
    (word.me13 == null) ? null : (result += "\n" + word.me13);

    return result;
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
