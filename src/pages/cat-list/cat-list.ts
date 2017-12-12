import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CommonUtil } from '../../utils/commonUtil';
import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';

import { LecListPage } from './../lec-list/lec-list';

@Component({
  selector: 'page-catList',
  templateUrl: 'cat-list.html'
})
export class CatListPage {

  subId: string;
  sub: Subject;
  cats: Array<Category>;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.subId = this.param.get('id');
    this.getSub();
    this.getCats();
  }

  getSub(): void {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByIdForSub(this.subId).then(item => {
        this.sub = item;
      });
    } else {
      this.sub = this.test_.selectSubById(this.subId);
    }
  }

  getCats(): void {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectBySubIdForCat(this.subId).then(items => {
        this.cats = items;
      });
    } else {
      this.cats = this.test_.selectAllCatsBySubId(this.subId);
    }
  }

  clickCat(cat: Category): void {
    this.navCtrl.push(LecListPage, {
      activeName: CommonUtil.getActiveName(this.subId), sub: this.sub, cat: cat});
  }

}
