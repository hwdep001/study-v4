import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DBHelper } from './../../providers/db-helper';
import { TestService } from './../../providers/test-service';

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

}
