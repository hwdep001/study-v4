import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

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
    this.sub = new Subject();

    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByIdForSub(this.subId).then(res => {
        if(res.rows.length > 0) {
          this.sub = res.rows.item(0);
        }
      });
    } else {
      this.sub = this.test_.selectSubById(this.subId);
    }
  }

  getCats(): void {
    this.cats = new Array();

    if(this.dbHelper.isCordova) {
      this.dbHelper.selectBySubIdForCat(this.subId).then(res => {
        for(let i=0; i<res.rows.length; i++) {
          this.cats.push(res.rows.item(i));
        }
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
