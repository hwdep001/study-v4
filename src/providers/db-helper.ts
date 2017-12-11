import { ContactDBCategory } from './db/contactDBCategory';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { ContactDBCount } from './db/contactDBCount';
import { ContactDBLevel } from './db/contactDBLevel';
import { ContactDBSubject } from './db/contactDBSubject';
import { ContactDBLecture } from './db/contactDBLecture';
import { ContactDBWord } from './db/contactDBWord';

import { User } from '../models/User';
import { TestService } from './test-service';
import { Subject } from '../models/Subject';

@Injectable()
export class DBHelper {

  private sql: SQLite;
  private sqlOb: SQLiteObject;
  isCordova: boolean;

  constructor(
    private countDB: ContactDBCount,
    private levelDB: ContactDBLevel,
    private subDB: ContactDBSubject,
    private catDB: ContactDBLecture,
    private lecDB: ContactDBCategory,
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
    this.lecDB.createTable(this.sqlOb);
    this.catDB.createTable(this.sqlOb);
    this.wordDB.createTable(this.sqlOb);
  }

  dropTables() {
    if(!this.isCordova) {return;}
    this.countDB.dropTable(this.sqlOb);
    this.levelDB.dropTable(this.sqlOb);
    this.subDB.dropTable(this.sqlOb);
    this.lecDB.dropTable(this.sqlOb);
    this.catDB.dropTable(this.sqlOb);
    this.wordDB.dropTable(this.sqlOb);
  }

  //////////////////////////////////////////////
  // SUBJECT
  //////////////////////////////////////////////

  insertSub(sub: Subject) {
    return this.subDB.insert(this.sqlOb, sub);
  }

  selectAllSubs(): Promise<any> {
    return this.subDB.selectAll(this.sqlOb)
  }

}