import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { DBHelper } from './../../../providers/db-helper';
import { CommonService } from './../../../providers/common-service';
import { TestService } from './../../../providers/test-service';

@Component({
  selector: 'page-wordTest',
  templateUrl: 'word-test.html'
})
export class WordTestPage {

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private dbHelper: DBHelper,
    private cmn_: CommonService,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    // this.ws = this.param.get("wordSearch");
  }
}
