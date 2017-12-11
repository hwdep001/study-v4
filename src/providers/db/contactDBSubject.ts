import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Subject } from './../../models/Subject';

@Injectable()
export class ContactDBSubject {

    private TAG = "SUBJECT";
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

    insert(sqlOb: SQLiteObject, sub: Subject) {
        return sqlOb.executeSql(this.query.INSERT, [sub.id, sub.name, sub.num])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + sub);
        })
        .catch(e => console.log(e));
    }

    update(sqlOb: SQLiteObject, sub: Subject) {
        return sqlOb.executeSql(this.query.UPDATE, [sub.name, sub.num, sub.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + sub);
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

    selectById(sqlOb: SQLiteObject, id: string): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_BY_ID, [id]);
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS subject ("
                                    + " id VARCHAR(32),"
                                    + " name VARCHAR(32),"
                                    + " num INT2, "
                                    + " PRIMARY KEY (id)"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS subject",
            INSERT:             "INSERT INTO subject "
                                    + " (id, name, num) "
                                    + " VALUES(?, ?, ?) ",
            UPDATE:             "UPDATE subject "
                                    + " SET name=?, num=? "
                                    + " WHERE id=? ",
            DELETE:             "DELETE FROM subject ",
            SELECT_ALL:         "SELECT id, name, num "
                                    + " FROM subject "
                                    + " ORDER BY num",
            SELECT_BY_ID:       "SELECT id, name, num "
                                    + " FROM subject "
                                    + " WHERE id=? ",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT?: string,
    UPDATE?: string,
    DELETE?: string,
    SELECT_ALL: string,
    SELECT_BY_ID?: string,
}