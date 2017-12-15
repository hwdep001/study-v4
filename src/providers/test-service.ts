import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { Count } from './../models/Count';
import { Level } from './../models/Level';
import { Subject } from './../models/Subject';
import { Category } from './../models/Category';
import { Lecture } from './../models/Lecture';
import { Word } from './../models/Word';

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

        for(let i=0; i<20; i++) {
            lecs.push({id:  catId + "-lec-" + i, name: catId + "-렉-" + i, num: i, version: 0});
        }

        return lecs;
    }

    selectAllWordByLecId(lecIds: Array<string>): Array<Word> {
        let words: Array<Word> = new Array();

        lecIds.forEach(lecId => {
            for(let i=0; i<5; i++) {
                words.push({
                    id: "id" + i+1,
                    num: i+1, 
                    lectureId: lecId, 
                    levelId: i%5-2, 
                    lectureName: "강의" + lecId,
                    que: "que" + i+1,
                    me1: "me1" + i+1,
                    me2: "me2" + i+1,
                    me3: "me3" + i+1,
                    me4: "me4" + i+1,
                    me5: "me5" + i+1,
                    me6: "me6" + i+1,
                    me7: "me7" + i+1,
                    me8: "me8" + i+1,
                    me9: "me9" + i+1,
                    me10: "me10" + i+1,
                    me11: "me11" + i+1,
                    me12: "me12" + i+1,
                    me13: "me13" + i+1,
                    syn: "syn" + i+1,
                    ant: "ant" + i+1,
                });
            }
        });

        return words;
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

    selectAllCounts(): Array<Count> {
        let cnts: Array<Count> = new Array();
        
        for(let i=10; i<=100; i=i+10) {
            cnts.push({id: i});
        }

        return cnts;
    }

}