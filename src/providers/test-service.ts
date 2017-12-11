import { Category } from './../models/Category';
import { environment } from './../environments/environment';
import { User } from './../models/User';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { Subject } from '../models/Subject';

@Injectable()
export class TestService {

    platform: string;
    subsRef: firebase.firestore.CollectionReference;

    constructor(
        
    ) {
        this.subsRef = firebase.firestore().collection("subs");
    }

    isCordova(): boolean {
        if(this.platform == "android" || this.platform == "ios") {
            return true;
        } else {
            return false;
        }
    }

    selectAllSubs() {
        let subs: Array<Subject> = new Array();

        subs.push({id: "sp", name: "맞춤법", num: 0});
        subs.push({id: "sl", name: "표준어", num: 1});
        subs.push({id: "lw", name: "외래어", num: 2});
        subs.push({id: "kw", name: "어휘", num: 3});
        subs.push({id: "cc", name: "한자어", num: 4});
        subs.push({id: "c4", name: "한자성어", num: 5});
        subs.push({id: "ew", name: "영단어", num: 6});

        return subs;
    }

    selectAllCatsBySubId(subId: string) {
        let cats: Array<Category> = new Array();

        for(let i=0; i<2; i++) {
            cats.push({id:  subId + "-cat-" + i, name: subId + "-카-" + i, num: i, version: 0});
        }

        return cats;
    }

}