import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Word } from './../../models/Word';
import { WordSearch } from './../../models/WordSearch';

@Component({
  selector: 'page-wordList',
  templateUrl: 'word-list.html'
})
export class WordListPage {

  words: Array<Word>;
  ws: WordSearch;

  constructor(
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.ws = this.param.get("wordSearch");
    this.getWords();
  }

  getWords(): void {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectBySearchForWord(this.ws.lecIds, 
          this.ws.levIds, this.ws.count, false).then(items => {

        this.words = items;
      });
    } else {
      this.words = this.test_.selectAllWordByLecId(this.ws.lecIds);
    }
  }

}
