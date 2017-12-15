import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CommonService } from '../../providers/common-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //test
  user;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService
  ) {
    this.user = cmn_.user;
  }
}
