import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { Level } from './../models/Level';
import { Subject } from './../models/Subject';
import { Category } from './../models/Category';
import { Lecture } from './../models/Lecture';

@Injectable()
export class TestService {

    platform: string;
    subsRef: firebase.firestore.CollectionReference;

    subMap: Map<string, Subject>;

    constructor(
        
    ) {
        this.subsRef = firebase.firestore().collection("subs");
        this.setSubMap();
    }

    isCordova(): boolean {
        if(this.platform == "android" || this.platform == "ios") {
            return true;
        } else {
            return false;
        }
    }

    setSubMap(): void {
        this.subMap = new Map<string, Subject>();
        this.subMap.set("sp", {id: "sp", name: "맞춤법",   num: 0});
        this.subMap.set("sl", {id: "sl", name: "표준어",   num: 1});
        this.subMap.set("lw", {id: "lw", name: "외래어",   num: 2});
        this.subMap.set("kw", {id: "kw", name: "어휘",     num: 3});
        this.subMap.set("cc", {id: "cc", name: "한자어",   num: 4});
        this.subMap.set("c4", {id: "c4", name: "한자성어", num: 5});
        this.subMap.set("ew", {id: "ew", name: "영단어",   num: 6});
    }

    selectAllSubs(): Array<Subject> {
        let subs: Array<Subject> = new Array();

        this.subMap.forEach( (sub: Subject, key: string) => {
            subs.push(sub);
        });

        return subs;
    }

    selectSubById(id: string): Subject {
        return this.subMap.get(id);
    }

    selectAllCatsBySubId(subId: string): Array<Category> {
        let cats: Array<Category> = new Array();

        for(let i=0; i<2; i++) {
            cats.push({id:  subId + "-cat-" + i, name: subId + "-카-" + i, num: i, version: 0});
        }

        return cats;
    }

    selectAllLecsBycatId(catId: string): Array<Lecture> {
        let lecs: Array<Lecture> = new Array();

        for(let i=0; i<2; i++) {
            lecs.push({id:  catId + "-lec-" + i, name: catId + "-렉-" + i, num: i, version: 0});
        }

        return lecs;
    }

    selectAllLevels(): Array<Level> {
        let levs: Array<Level> = new Array();
        levs.push({id:  2, name: "Very Easy"});
        levs.push({id:  1, name: "Easy"});
        levs.push({id:  0, name: "Normal"});
        levs.push({id:  -1, name: "Difficult"});
        levs.push({id:  -2, name: "Very Difficult"});

        return levs;
    }
}