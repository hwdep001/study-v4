import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ContactDBWord {

    private TAG = "WORD";
    private query: query;

    constructor(
    ) {
        this.initQuery();
    }

    createTable(sqlOb: SQLiteObject) {
        sqlOb.executeSql(this.query.CREATE_TABLE, {})
        .then(res => {
            console.log("TABLE CREATED: " + this.TAG);
        })
        .catch(e => console.log(e));
    }

    dropTable(sqlOb: SQLiteObject) {
        sqlOb.executeSql(this.query.DROP_TABLE, {})
        .then(res => {
            console.log("TABLE DROPED: " + this.TAG);
        })
        .catch(e => console.log(e));
    }

    // insert(sqlOb: SQLiteObject, word: Word) {
    //     sqlOb.executeSql(this.query.INSERT, [sub.id, sub.name, sub.num])
    //     .then(res => {
    //         console.log("TABLE INSERTED: " + res);
    //     })
    //     .catch(e => console.log(e));
    // }

    // selectAll(sqlOb: SQLiteObject): Promise<any> {
    //     return sqlOb.executeSql(this.query.SELECT_ALL, {});
    // }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:   "CREATE TABLE IF NOT EXISTS word ("
                                + "id VARCHAR(32),"
                                + "head1 VARCHAR(64),"
                                + "head2 VARCHAR(64),"
                                + "body1 TEXT,"
                                + "body2 TEXT,"
                                + "num INT,"
                                + "lectureId VARCHAR(32), "
                                + "levelId INT2 DEFAULT 0, "
                                + " PRIMARY KEY (id), "
                                + " FOREIGN KEY (lectureId) "
                                + " REFERENCES lecture (id) ON DELETE CASCADE, "
                                + " FOREIGN KEY (levelId) "
                                + " REFERENCES level (levelId) ON DELETE SET DEFAULT "
                                + ")",
            DROP_TABLE:     "DROP TABLE IF EXISTS word",
            // INSERT:         "INSERT INTO word "
            //                     + " (id, name, num) "
            //                     + " VALUES(?, ?, ?) ",
            // SELECT_ALL:     "SELECT id, name, num "
            //                     + " FROM word "
            //                     + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    // INSERT?: string,
    // SELECT_ALL?: string,
}