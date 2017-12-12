import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../providers/common-service';
import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';

@Component({
  selector: 'page-catList',
  templateUrl: 'cat-list.html'
})
export class CatListPage {

  subKey: string;
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
    this.subKey = this.param.get(`key`);
    this.getSub();
    this.getCats();
  }

  getSub(): void {
    this.sub = new Subject();

    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByIdForSub(this.subKey).then(res => {
        if(res.rows.length > 0) {
          this.sub = res.rows.item(0);
        }
      });
    } else {
      this.sub = this.test_.selectSubById(this.subKey);
    }
  }

  getCats(): void {
    this.cats = new Array();

    if(this.dbHelper.isCordova) {
      this.dbHelper.selectBySubIdForCat(this.subKey).then(res => {
        for(let i=0; i<res.rows.length; i++) {
          this.cats.push(res.rows.item(i));
        }
      });
    } else {
      this.cats = this.test_.selectAllCatsBySubId(this.subKey);
    }
  }

}
