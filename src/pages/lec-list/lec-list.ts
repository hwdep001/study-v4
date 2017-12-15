import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CommonUtil } from './../../utils/commonUtil';
import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';
import { Lecture } from './../../models/Lecture';
import { WordSearch } from './../../models/WordSearch';

import { EwListPage } from './../word/ew-list/ew-list';
import { SpsllwListPage } from './../word/spsllw-list/spsllw-list';
import { WordTestPage } from './../word/word-test/word-test';

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
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByCatIdForLec(this.cat.id).then(items => {
        this.lecs = items;
      });
    } else {
      this.lecs = this.test_.selectAllLecsBycatId(this.cat.id);
    }
  }

  clickLec(lec: Lecture): void {
    let levIds = new Array<number>();
    let count = -1;
    let lecIds = [lec.id];

    const params = {
      activeName: CommonUtil.getActiveName(this.sub.id), 
      wordSearch: new WordSearch(this.cat, lec, lecIds, levIds, count, false)
    }

    switch(this.sub.id) {
      case "sp":
      case "sl":
      case "lw":
        this.navCtrl.push(SpsllwListPage, params);
        break;
      case "kr":
        break;
      case "cc":
        break;
      case "c4":
        break;
      case "ew":
        this.navCtrl.push(EwListPage, params);
        break;
    }
  }

  moveWordTestPage(): void {
    const params = {
      activeName: CommonUtil.getActiveName(this.sub.id), 
      sub: this.sub, 
      cat: this.cat
    }

    this.navCtrl.push(WordTestPage, params);
  }

}
