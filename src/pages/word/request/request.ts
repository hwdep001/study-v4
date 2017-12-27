import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import * as firebase from 'firebase';

import { CommonService } from './../../../providers/common-service';

import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { Word } from './../../../models/Word';

@Component({
  selector: 'page-request',
  templateUrl: 'request.html'
})
export class RequestPage {

  reqRef: firebase.firestore.CollectionReference;

  subId: string;
  catId: string;
  word: Word;
  msg: string;

  constructor(
    private param: NavParams,
    private cmn_: CommonService
  ) {
    this.initData();
  }

  initData(): void {
    this.reqRef = firebase.firestore().collection("requests");
    this.subId = this.param.get("subId");
    this.catId = this.param.get("catId");
    this.word = this.param.get("word");
  }

  request(): void {
    if(this.msg == null || this.msg.trim() == "") {
      this.cmn_.Toast.present('bottom', "내용을 작성해 주세요.", 'toast-fail');
      return;
    }
    
    this.reqRef.add({
      reqDate: new Date().yyyy_MM_dd_HH_mm_ss(),
      reqUid: this.cmn_.uid,
      isCompletion: false,
      subId: this.subId,
      catId: this.catId,
      word: this.word,
      message: this.msg
    }).then( doc => {
      this.cmn_.Toast.present('bottom', "요청 성공", 'toast-success');
    }).catch(err => {
      this.cmn_.Toast.present('bottom', "요청 실패", 'toast-fail');
    });
  }
}
