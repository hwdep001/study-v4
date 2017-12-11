import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Subject } from './../../models/Subject';

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

    insert(sqlOb: SQLiteObject, sub: Subject) {
        sqlOb.executeSql(this.query.INSERT, [sub.id, sub.name, sub.num])
        .then(res => {
            console.log("TABLE INSERTED: " + res);
        })
        .catch(e => console.log(e));
    }

    selectAll(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_ALL, {});
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:   "CREATE TABLE IF NOT EXISTS subject ("
                                + " id VARCHAR(32),"
                                + " name VARCHAR(32),"
                                + " num INT2, "
                                + " PRIMARY KEY (id)"
                                + " )",
            DROP_TABLE:     "DROP TABLE IF EXISTS subject",
            INSERT:         "INSERT INTO subject "
                                + " (id, name, num) "
                                + " VALUES(?, ?, ?) ",
            SELECT_ALL:     "SELECT id, name, num "
                                + " FROM subject "
                                + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT?: string,
    SELECT_ALL?: string,
}