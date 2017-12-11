import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

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
    
    delete(sqlOb: SQLiteObject) {
        return sqlOb.executeSql(this.query.DELETE, [])
        .then(res => {
            console.log(this.TAG + " DELETED");
        })
        .catch(e => console.log(e));
    }

    // insert(sqlOb: SQLiteObject, cat: Category) {
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
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS count ("
                                    + " id INT,"
                                    + " PRIMARY KEY (id)"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS count",
            DELETE:             "DELETE FROM count ",
            // INSERT:         "INSERT INTO category "
            //                     + " (id, name, num) "
            //                     + " VALUES(?, ?, ?) ",
            // SELECT_ALL:     "SELECT id, name, num "
            //                     + " FROM category "
            //                     + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    DELETE?: string,
    // INSERT?: string,
    // SELECT_ALL?: string,
}