import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class UserService {

    private sql: SQLite;
    private sqlOb: SQLiteObject;

    constructor(
    ) {
        if(this.sqlOb == null) {
            this.createTable();
          }
    }

    createTable() {
        // this.sql = new SQLite();
        // this.sql.create({
        //   name: 'study.db',
        //   location: 'default'
        // })
        // .then( (db: SQLiteObject) => {
        //   const sql = "CREATE TABLE IF NOT EXISTS word_level (" 
        //             + "sub TEXT, cat TEXT, lec TEXT, word TEXT, lv INTEGER, "
        //             + "PRIMARY KEY(sub, cat, lec, word) )"
        //   db.executeSql(sql, {})
        //   .then(res => {
        //     console.log("TABLE CREATED: " + res);
        //     this.sqlOb = db;
        //   })
        //   .catch(e => console.log(e));
        // }).catch(e => console.log(e));
    }
}