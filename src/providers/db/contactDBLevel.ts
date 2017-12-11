import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Level } from '../../models/Level';

@Injectable()
export class ContactDBLevel {

    private TAG = "LEVEL";
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

    insert(sqlOb: SQLiteObject, level: Level) {
        return sqlOb.executeSql(this.query.INSERT, 
            [level.id, level.name])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + level.name);
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

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS level ("
                                    + " id INT2,"
                                    + " name VARCHAR(16),"
                                    + " PRIMARY KEY (id)"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS level",
            INSERT:             "INSERT INTO level (id, name) "
                                    + " VALUES (?, ?)",
            DELETE:             "DELETE FROM level ",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT?: string,
    DELETE?: string,
}