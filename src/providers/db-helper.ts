import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { ContactDBCount } from './db/contactDBCount';
import { ContactDBLevel } from './db/contactDBLevel';
import { ContactDBSubject } from './db/contactDBSubject';
import { ContactDBCategory } from './db/contactDBCategory';
import { ContactDBLecture } from './db/contactDBLecture';
import { ContactDBWord } from './db/contactDBWord';
import { TestService } from './test-service';

import { Count } from './../models/Count';
import { Level } from './../models/Level';
import { Subject } from './../models/Subject';
import { Lecture } from './../models/Lecture';
import { Category } from './../models/Category';
import { Word } from './../models/Word';

@Injectable()
export class DBHelper {

  private sql: SQLite;
  private sqlOb: SQLiteObject;
  isCordova: boolean;

  constructor(
    private countDB: ContactDBCount,
    private levelDB: ContactDBLevel,
    private subDB: ContactDBSubject,
    private catDB: ContactDBCategory,
    private lecDB: ContactDBLecture,
    private wordDB: ContactDBWord,
    private test_: TestService
  ) {

  }

  getSQLiteObject() {
    this.isCordova = this.test_.isCordova();

    if(!this.isCordova) {return;}
    this.sql = new SQLite();
    this.sql.create({
      name: 'study.db',
      location: 'default'
    })
    .then( (db: SQLiteObject) => {
      this.sqlOb = db;
      this.initializeTable();
    });
  }

  initializeTable() {
    if(!this.isCordova) {return;}
    this.countDB.createTable(this.sqlOb);
    this.levelDB.createTable(this.sqlOb);
    this.subDB.createTable(this.sqlOb);
    this.catDB.createTable(this.sqlOb);
    this.lecDB.createTable(this.sqlOb);
    this.wordDB.createTable(this.sqlOb);
  }

  dropTables() {
    if(!this.isCordova) {return;}
    this.countDB.dropTable(this.sqlOb);
    this.levelDB.dropTable(this.sqlOb);
    this.subDB.dropTable(this.sqlOb);
    this.catDB.dropTable(this.sqlOb);
    this.lecDB.dropTable(this.sqlOb);
    this.wordDB.dropTable(this.sqlOb);
  }

  deleteTables() {
    if(!this.isCordova) {return;}
    this.countDB.delete(this.sqlOb);
    this.levelDB.delete(this.sqlOb);
    this.subDB.delete(this.sqlOb);
    this.catDB.delete(this.sqlOb);
    this.lecDB.delete(this.sqlOb);
    this.wordDB.delete(this.sqlOb);
  }

  //////////////////////////////////////////////
  // Count
  //////////////////////////////////////////////

  insertCount(count: Count): Promise<any> {
    return this.countDB.insert(this.sqlOb, count);
  }

  deleteCount(): Promise<any> {
    return this.countDB.delete(this.sqlOb);
  }

  //////////////////////////////////////////////
  // Level
  //////////////////////////////////////////////

  insertLevel(level: Level): Promise<any> {
    return this.levelDB.insert(this.sqlOb, level);
  }

  deleteLevel(): Promise<any> {
    return this.levelDB.delete(this.sqlOb);
  }

  //////////////////////////////////////////////
  // SUBJECT
  //////////////////////////////////////////////

  insertSub(sub: Subject): Promise<any> {
    return this.subDB.insert(this.sqlOb, sub);
  }

  updateSub(sub: Subject): Promise<any> {
    return this.subDB.update(this.sqlOb, sub);
  }

  selectAllForSub(): Promise<any> {
    return this.subDB.selectAll(this.sqlOb);
  }

  selectByIdForSub(id: string): Promise<any> {
    return this.subDB.selectById(this.sqlOb, id);
  }

  //////////////////////////////////////////////
  // CATEGORY
  //////////////////////////////////////////////

  insertWithOutVersionCat(cat: Category): Promise<any> {
    return this.catDB.insertWithOutVersion(this.sqlOb, cat);
  }

  updateCat(cat: Category): Promise<any> {
    return this.catDB.update(this.sqlOb, cat);
  }
  
  updateWithOutVersionCat(cat: Category): Promise<any> {
    return this.catDB.updateWithOutVersion(this.sqlOb, cat);
  }
  
  deleteByIdForCat(id: string): Promise<any> {
    return this.catDB.deleteById(this.sqlOb, id);
  }
  
  selectBySubIdForCat(subId: string): Promise<any> {
    return this.catDB.selectBySubId(this.sqlOb, subId);
  }

  //////////////////////////////////////////////
  // LECTURE
  //////////////////////////////////////////////

  insertWithOutVersionLec(lec: Lecture): Promise<any> {
    return this.lecDB.insertWithOutVersion(this.sqlOb, lec);
  }
  
  updateLec(lec: Lecture): Promise<any> {
    return this.lecDB.update(this.sqlOb, lec);
  }

  updateWithOutVersionLec(lec: Lecture): Promise<any> {
    return this.lecDB.updateWithOutVersion(this.sqlOb, lec);
  }
  
  deleteByIdForLec(id: string): Promise<any> {
    return this.lecDB.deleteById(this.sqlOb, id);
  }
  
  selectByCatIdForLec(catId: string): Promise<any> {
    return this.lecDB.selectByCatId(this.sqlOb, catId);
  }

  //////////////////////////////////////////////
  // WORD
  //////////////////////////////////////////////

  insertWord(word: Word): Promise<any> {
    return this.wordDB.insert(this.sqlOb, word);
  }
  
  updateWithOutLevelWord(word: Word): Promise<any> {
    return this.wordDB.updateWithOutLevel(this.sqlOb, word);
  }
  
  deleteByIdForWord(id: string): Promise<any> {
    return this.wordDB.deleteById(this.sqlOb, id);
  }
  
  selectByLecIdForWord(lecId: string): Promise<any> {
    return this.wordDB.selectByLecId(this.sqlOb, lecId);
  }
}