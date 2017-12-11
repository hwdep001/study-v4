import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User } from '../models/User';

@Injectable()
export class UserService {

    private sql: SQLite;
    private sqlOb: SQLiteObject;
    private query: query;

    constructor(
    ) {
        this.initQuery();

        if(this.sqlOb == null) {
            this.createTable();
        }
    }

    createTable() {
        this.sql = new SQLite();
        this.sql.create({
          name: 'study.db',
          location: 'default'
        })
        .then( (db: SQLiteObject) => {
          const sql = this.query.CREATE_TABLE
          db.executeSql(sql, {})
          .then(res => {
            console.log("TABLE CREATED: " + res);
            this.sqlOb = db;
          })
          .catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    dropTable() {
        this.sql = new SQLite();
        this.sql.create({
          name: 'study.db',
          location: 'default'
        })
        .then( (db: SQLiteObject) => {
          const sql = this.query.DROP_TABLE
          db.executeSql(sql, {})
          .then(res => {
            console.log("TABLE CREATED: " + res);
            this.sqlOb = db;
          })
          .catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    insert(user: User) {
        this.sql = new SQLite();
        this.sql.create({
          name: 'study.db',
          location: 'default'
        })
        .then( (db: SQLiteObject) => {
          const sql = this.query.INSERT
          db.executeSql(sql, [user.uid, user.displayName, user.email, user.photoURL, user.isSignIn, user.isAuth])
          .then(res => {
            console.log("TABLE CREATED: " + res);
            this.sqlOb = db;
          })
          .catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    selectByUid(user: User) {
        
    }

    private initQuery() {
        this.query = {
            CREATE_TABLE:   "CREATE TABLE IF NOT EXISTS user ("
                                + " uid VARCHAR(32), "
                                + " displayName VARCHAR(32), "
                                + " email VARCHAR(64), "
                                + " photoURL TEXT, "
                                + " isSignIn boolean, "
                                + " isAuth boolean, "
                                + " PRIMARY KEY (uid) "
                                + ")",
            DROP_TABLE:     "DROP TABLE IF EXISTS user",
            INSERT:         "INSERT INTO user "
                                + " (uid, displayName, email, photoURL, isSignIn, isAuth) "
                                + " VALUES (?, ? ,?, ?, ?, ?)",
            SELECT_BY_UID:  "SELECT * "
                                + " FROM user "
                                + " WHERE uid=? "


        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT?: string,
    SELECT_BY_UID?: string,
}