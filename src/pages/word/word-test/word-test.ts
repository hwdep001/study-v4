import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { CommonUtil } from './../../../utils/commonUtil';
import { DBHelper } from './../../../providers/db-helper';
import { TestService } from './../../../providers/test-service';

import { Count } from './../../../models/Count';
import { Level } from './../../../models/Level';
import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { WordSearch } from './../../../models/WordSearch';

import { EwListPage } from './../ew-list/ew-list';
import { SpsllwListPage } from './../spsllw-list/spsllw-list';
import { KrListPage } from './../kr-list/kr-list';

@Component({
  selector: 'page-wordTest',
  templateUrl: 'word-test.html'
})
export class WordTestPage {

  sub: Subject;
  cat: Category;
  lecs: Array<Lecture>;
  levs: Array<Level>;
  cnts: Array<Count>;

  lecRange: any = { lower: 1, upper: 1 };

  selectLecs: Array<string>;
  selectLevs: Array<number>;
  selectCnt: number;
  selectLecType: number = 0;  // 0: Checkbox, 1: Range

  isStartBtn: boolean = false;

  // checkbox
  cbA: boolean = false;
  cbs: Array<boolean>;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.initData();
  }

  initData(): void {
    this.sub = this.param.get("sub");
    this.cat = this.param.get("cat");
    this.getLecs();
    this.getLevs();
    this.getCnts();
  }

  getLecs(): void {
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectByCatIdForLec(this.cat.id).then(items => {
        this.lecs = items;

        this.initCheckbox(false);
        this.lecRange = { lower: 1, upper: this.lecs.length };
      });
    } else {
      this.lecs = this.test_.selectAllLecsBycatId(this.cat.id);

      this.initCheckbox(false);
      this.lecRange = { lower: 1, upper: this.lecs.length };
    }
  }

  getLevs(): void {
    this.selectLevs = new Array<number>();
    
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectAllForLevel().then(items => {
        this.levs = items;
        let levIds = new Array<number>();
        this.levs.forEach(lev => {
          levIds.push(lev.id);
        });
        this.selectLevs = levIds;
      })
    } else {
      this.levs = this.test_.selectAllLevels();

      this.levs.forEach(lev => {
        this.selectLevs.push(lev.id);
      });
    }    
  }

  getCnts(): void {
    this.cnts = new Array<Count>();
    
    if(this.dbHelper.isCordova) {
      this.dbHelper.selectAllForCount().then(items => {
        this.cnts = items;
        
        this.selectCnt = this.cnts[1].id;
      });
    } else {
      this.cnts = this.test_.selectAllCounts();

      this.selectCnt = this.cnts[1].id;
    }
  }

  initCheckbox(bl: boolean) {
    this.cbA = bl;
    this.isStartBtn = bl;

    this.cbs = new Array<boolean>();
    for(let i=0; i< this.lecs.length; i++) {
      this.cbs.push(bl);
    }
  }

  checkCb(cb: boolean) {
    if(!cb) {
      this.cbA = false;
    } else {
      let result: boolean = true;
      this.cbs.every( (ele, index) => {
        if(!ele) {
          this.cbA = false;
          result = false;
        }
        return ele;
      });
      if(result) {this.cbA = true;}
    }
  }

  checkStartBtn(): void {
    if(this.selectLevs.length == 0) {
      this.isStartBtn = false;
      return;
    }

    if(this.selectLecType == 0) {
      let isExistTrue: boolean = false;
      this.cbs.every( (ele, index) => {
        if(ele) {
          isExistTrue = true;
        }
        return !ele;
      });
      if(!isExistTrue) {
        this.isStartBtn = false;
        return;
      }
    }

    this.isStartBtn = true;
  }

  startTest() {
    this.setSelectLecs();
    
    const params = {
      activeName: CommonUtil.getActiveName(this.sub.id), 
      wordSearch: new WordSearch(
        this.cat, null, this.selectLecs, this.selectLevs, this.selectCnt, true
      )
    }

    switch(this.sub.id) {
      case "sp":
      case "sl":
      case "lw":
        this.navCtrl.push(SpsllwListPage, params);
        break;
      case "kr":
        this.navCtrl.push(KrListPage, params);
        break;
      case "cc":
        // break;
      case "c4":
        // break;
      case "ew":
        this.navCtrl.push(EwListPage, params);
        break;
    }
  }

  setSelectLecs(): void {
    let selectLecs: Array<string> = new Array();
    if(this.selectLecType == 0) {
      // checkbox
      for(let i=0; i<this.cbs.length; i++) {
        if(this.cbs[i]) {
          selectLecs.push(this.lecs[i].id);
        }
      }
    } else {
      // range
      for(let i=this.lecRange.lower; i<=this.lecRange.upper; i++) {
        selectLecs.push(this.lecs[i-1].id);
      }
    }

    this.selectLecs = selectLecs;
  }
}
