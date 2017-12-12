import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Count } from './../../models/Count';

@Injectable()
export class ContactDBCount {

    private TAG = "COUNT";
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

    insert(sqlOb: SQLiteObject, count: Count) {
        return sqlOb.executeSql(this.query.INSERT, 
            [count.id])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + count.id);
        })
        .catch(e => console.log(e));
    }

    delete(sqlOb: SQLiteObject) {
        return sqlOb.executeSql(this.query.DELETE, [])
        .then(res => {
            console.log(this.TAG + " DELETED");
        })
        .catch(e => console.log(e));
    }

    selectAll(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_ALL, {});
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS count ("
                                    + " id INT,"
                                    + " PRIMARY KEY (id)"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS count",
            INSERT:             "INSERT INTO count (id) "
                                    + " VALUES (?)",
            DELETE:             "DELETE FROM count ",
            SELECT_ALL:         "SELECT id "
                                    + " FROM count "
                                    + " ORDER BY id",
        }
        
    }
}

interface query {
    CREATE_TABLE: string,
    DROP_TABLE: string,
    INSERT: string,
    DELETE: string,
    SELECT_ALL: string,
}