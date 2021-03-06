import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Level } from '../../models/Level';

@Injectable()
export class ContactDBLevel {

    private TAG = "LEVEL";
    private query: query;

    constructor(
    ) {
        this.initQuery();
    }

    createTable(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.CREATE_TABLE, {})
        .then(res => {
            console.log("TABLE CREATED: " + this.TAG);
        })
        .catch(e => console.log(e));
    }

    dropTable(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.DROP_TABLE, {})
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

    selectAll(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_ALL, {});
    }

    

    initDefaultData(sqlOb: SQLiteObject): Promise<any> {
        let pros = new Array<Promise<any>>();

        let levs: Array<Level> = new Array();
        levs.push({id:  2, name: "Very Easy"});
        levs.push({id:  1, name: "Easy"});
        levs.push({id:  0, name: "Normal"});
        levs.push({id:  -1, name: "Difficult"});
        levs.push({id:  -2, name: "Very Difficult"});

        levs.forEach(lev => {
            pros.push(this.insert(sqlOb, lev));
        });

        return Promise.all(pros);
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
            SELECT_ALL:         "SELECT id, name "
                                    + " FROM level "
                                    + " ORDER BY id DESC",
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