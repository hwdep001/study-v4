import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ContactDBSubject {

    private query: query;

    constructor(
    ) {
        this.initQuery();
    }

    createTable(sqlOb: SQLiteObject) {
        sqlOb.executeSql(this.query.CREATE_TABLE, {})
        .then(res => {
            console.log("TABLE CREATED: " + res);
        })
        .catch(e => console.log(e));
    }

    dropTable(sqlOb: SQLiteObject) {
        sqlOb.executeSql(this.query.DROP_TABLE, {})
        .then(res => {
            console.log("TABLE DROPED: " + res);
        })
        .catch(e => console.log(e));
    }

    // insert(user: User) {
    //     this.sql = new SQLite();
    //     this.sql.create({
    //       name: 'study.db',
    //       location: 'default'
    //     })
    //     .then( (db: SQLiteObject) => {
    //       const sql = this.query.INSERT
    //       db.executeSql(sql, [user.uid, user.displayName, user.email, user.photoURL, user.isSignIn, user.isAuth])
    //       .then(res => {
    //         console.log("TABLE CREATED: " + res);
    //         this.sqlOb = db;
    //       })
    //       .catch(e => console.log(e));
    //     }).catch(e => console.log(e));
    // }

    private initQuery() {
        this.query = {
            CREATE_TABLE:   "CREATE TABLE IF NOT EXISTS subject ("
                              + " id VARCHAR(32),"
                              + " name VARCHAR(32),"
                              + " num INT2, "
                              + " PRIMARY KEY (id)"
                              + " )",
            DROP_TABLE:     "DROP TABLE IF EXISTS subject",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
}