import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { ContactDBSubject } from './db/contactDBSubject';

import { User } from '../models/User';
import { TestService } from './test-service';
import { Subject } from '../models/Subject';

@Injectable()
export class DBHelper {

  private sql: SQLite;
  private sqlOb: SQLiteObject;
  isCordova: boolean;

  constructor(
    private subDB: ContactDBSubject,
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
    this.subDB.createTable(this.sqlOb);
  }

  dropTables() {
    if(!this.isCordova) {return;}
    this.subDB.dropTable(this.sqlOb);
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