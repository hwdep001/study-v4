import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DBHelper } from './../../providers/db-helper';
import { CommonUtil } from './../../utils/commonUtil';
import { TestService } from './../../providers/test-service';

import { CatListPage } from './../cat-list/cat-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cntMap: Array<any>

  constructor(
    public navCtrl: NavController,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectCountGroupBySubIdForWord().then(items => {
        this.cntMap = items;
      });
    } else {
      this.cntMap = this.test_.selectCountGroupBySubIdForWord();
    }
  }

  clickSub(subId: string): void {
    const params = {
      activeName: CommonUtil.getActiveName(subId), 
      id: subId
    }
    this.navCtrl.setRoot(CatListPage, params);
  }

}
