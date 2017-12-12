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

  constructor(
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    const wordSearch: WordSearch = this.param.get("wordSearch");
  }

}
