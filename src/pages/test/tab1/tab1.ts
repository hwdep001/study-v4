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
    this.dbHelper.initializeTable();
  }

  clickDropBtn() {
    this.dbHelper.dropTables();
  }

  setCounts() {
    let array = new Array<number>();
    for(let i=10; i<=100; i=i+10) {
      array.push(i);
    }
    firebase.firestore().collection("counts").doc("counts").set({array: array})
  }

  
}
