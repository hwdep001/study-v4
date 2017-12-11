import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { ContactDBSubject } from './db/contactDBSubject';

import { User } from '../models/User';

@Injectable()
export class DBHelper {

  private sql: SQLite;
  private sqlOb: SQLiteObject;

  private mode = true; // web 
  // private mode = false; // device

  constructor(
    private subDB: ContactDBSubject
  ) {
      this.getSQLiteObject();
  }

  getSQLiteObject() {
    if(this.mode) {return;}
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
    if(this.mode) {return;}
    this.subDB.createTable(this.sqlOb);
  }

  dropTables() {
    if(this.mode) {return;}
    this.subDB.dropTable(this.sqlOb);
  }

}