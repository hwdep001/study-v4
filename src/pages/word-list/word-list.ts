import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';
import { Lecture } from './../../models/Lecture';

@Component({
  selector: 'page-wordList',
  templateUrl: 'word-list.html'
})
export class WordListPage {

  sub: Subject;
  cat: Category;
  lec: Lecture;

  constructor(
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.sub = this.param.get(`sub`);
    this.cat = this.param.get(`cat`);
    this.lec = this.param.get(`lec`);
  }

}
