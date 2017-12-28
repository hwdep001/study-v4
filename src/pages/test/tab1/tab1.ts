import { Component } from '@angular/core';

import { CommonService } from './../../../providers/common-service';
import { DBHelper } from './../../../providers/db-helper';

import * as firebase from 'firebase';
import { User } from '../../../models/User';

@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {

  private user: User;

  constructor(
    private dbHelper: DBHelper,
    private cmn_: CommonService
  ) {

    this.user = cmn_.user;
  }

  clickCreateBtn() {
    this.cmn_.Alert.confirm().then(any => {
      this.dbHelper.initializeTable();
    }).catch(err => {});
  }

  clickDropBtn() {
    this.cmn_.Alert.confirm().then(any => {
      this.dbHelper.dropTables();
    }).catch(err => {});
  }

  deleteSub(id: string) {
    this.cmn_.Alert.confirm().then(any => {
      this.dbHelper.deleteByIdForSub(id);
    }).catch(err => {});
  }
  
}
