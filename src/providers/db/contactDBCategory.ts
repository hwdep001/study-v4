import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Category } from '../../models/Category';

@Injectable()
export class ContactDBCategory {

    private TAG = "CATEGORY";
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

    insertWithOutVersion(sqlOb: SQLiteObject, cat: Category) {
        return sqlOb.executeSql(this.query.INSERT_WITHOUT_VERSION, 
            [cat.id, cat.name, cat.num, cat.subjectId])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + cat.name);
        })
        .catch(e => console.log(e));
    }

    updateWithOutVersion(sqlOb: SQLiteObject, cat: Category) {
        return sqlOb.executeSql(this.query.UPDATE_WITHOUT_VERSION, 
            [cat.name, cat.num, cat.subjectId, cat.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + cat.name);
        })
        .catch(e => console.log(e));
    }

    deleteById(sqlOb: SQLiteObject, id: string) {
        return sqlOb.executeSql(this.query.DELETE_BY_ID, 
            [id])
        .then(res => {
            console.log(this.TAG + " DELETED: " + id);
        })
        .catch(e => console.log(e));
    }

    selectBySubId(sqlOb: SQLiteObject, subId: string): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_BY_SUBJECT, [subId]);
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS category ("
                                    + " id VARCHAR(32),"
                                    + " name VARCHAR(32),"
                                    + " num INT2, "
                                    + " version INT8, "
                                    + " subjectId VARCHAR(32), "
                                    + " PRIMARY KEY (id), "
                                    + " FOREIGN KEY (subjectId) "
                                    + " REFERENCES subject (id) ON DELETE CASCADE"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS category",
            INSERT_WITHOUT_VERSION:             
                                "INSERT INTO category "
                                    + " (id, name, num, version, subjectId) "
                                    + " VALUES(?, ?, ?, -1, ?) ",
            UPDATE_WITHOUT_VERSION: 
                                "UPDATE category "
                                    + " SET name=?, num=?, version=-1, subjectId=? "
                                    + " WHERE id=? ",
            DELETE:             "DELETE FROM category ",
            DELETE_BY_ID:       "DELETE FROM category WHERE id=?",
            SELECT_BY_SUBJECT:  "SELECT id, name, num, version, subjectId "
                                    + " FROM category "
                                    + " WHERE subjectId=? "
                                    + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT_WITHOUT_VERSION?: string,
    UPDATE_WITHOUT_VERSION?: string,
    DELETE?: string,
    DELETE_BY_ID?: string,
    SELECT_BY_SUBJECT?: string,
}