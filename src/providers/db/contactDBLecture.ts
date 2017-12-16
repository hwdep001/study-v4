import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Lecture } from './../../models/Lecture';

@Injectable()
export class ContactDBLecture {

    private TAG = "LECTURE";
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

    delete(sqlOb: SQLiteObject) {
        return sqlOb.executeSql(this.query.DELETE, [])
        .then(res => {
            console.log(this.TAG + " DELETED");
        })
        .catch(e => console.log(e));
    }

    insertWithOutVersion(sqlOb: SQLiteObject, lec: Lecture) {
        return sqlOb.executeSql(this.query.INSERT_WITHOUT_VERSION, 
            [lec.id, lec.name, lec.num, lec.categoryId])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + lec.name);
        })
        .catch(e => console.log(e));
    }

    update(sqlOb: SQLiteObject, lec: Lecture) {
        return sqlOb.executeSql(this.query.UPDATE, 
            [lec.name, lec.num, lec.version, lec.categoryId, lec.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + lec.name);
        })
        .catch(e => console.log(e));
    }

    updateWithOutVersion(sqlOb: SQLiteObject, lec: Lecture) {
        return sqlOb.executeSql(this.query.UPDATE_WITHOUT_VERSION, 
            [lec.name, lec.num, lec.categoryId, lec.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + lec.name);
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

    selectByCatId(sqlOb: SQLiteObject, catId: string): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_BY_CATEGORY, [catId]);
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS lecture ("
                                    + " id VARCHAR(32),"
                                    + " name VARCHAR(32),"
                                    + " num INT2, "
                                    + " version INT8, "
                                    + " categoryId VARCHAR(32), "
                                    + " PRIMARY KEY (id), "
                                    + " FOREIGN KEY (categoryId) "
                                    + " REFERENCES category (id) ON DELETE CASCADE"
                                    + " )",
            DROP_TABLE:         "DROP TABLE IF EXISTS lecture",
            INSERT_WITHOUT_VERSION:             
                                "INSERT INTO lecture "
                                    + " (id, name, num, version, categoryId) "
                                    + " VALUES(?, ?, ?, -1, ?) ",
            UPDATE:             "UPDATE lecture"
                                    + " SET name=?, num=?, version=?, categoryId=? "
                                    + " WHERE id=? ",
            UPDATE_WITHOUT_VERSION: 
                                "UPDATE lecture "
                                    + " SET name=?, num=?, version=-1, categoryId=? "
                                    + " WHERE id=? ",
            DELETE:             "DELETE FROM lecture ",
            DELETE_BY_ID:       "DELETE FROM lecture WHERE id=?",
            SELECT_BY_CATEGORY: "SELECT id, name, num, version, categoryId "
                                    + " FROM lecture "
                                    + " WHERE categoryId=? "
                                    + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE: string,
    DROP_TABLE: string,
    INSERT_WITHOUT_VERSION: string,
    UPDATE: string,
    UPDATE_WITHOUT_VERSION: string,
    DELETE: string,
    DELETE_BY_ID: string,
    SELECT_BY_CATEGORY: string,
}