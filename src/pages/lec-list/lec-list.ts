import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonUtil } from './../../utils/commonUtil';
import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Category } from './../../models/Category';
import { Lecture } from './../../models/Lecture';
import { Subject } from './../../models/Subject';

import { WordListPage } from './../word-list/word-list';

@Component({
  selector: 'page-lecList',
  templateUrl: 'lec-list.html'
})
export class LecListPage {

  sub: Subject;
  cat: Category;
  lecs: Array<Lecture>;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.sub = this.param.get(`sub`);
    this.cat = this.param.get(`cat`);

    this.getLecs();
  }

  getLecs(): void {
    this.lecs = new Array<Lecture>();

    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByCatIdForLec(this.cat.id).then(res => {
        for(let i=0; i<res.rows.length; i++) {
          this.lecs.push(res.rows.item(i));
        }
      });
    } else {
      this.lecs = this.test_.selectAllLecsBycatId(this.cat.id);
    }
  }

  clickLec(lec: Lecture): void {
    this.navCtrl.push(WordListPage, {
      activeName: CommonUtil.getActiveName(this.sub.id), 
      sub: this.sub, cat: this.cat, lec: lec});
  }

  moveLecTestPage(): void {

  }

}
