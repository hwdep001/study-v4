import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Subject } from './../../models/Subject';

@Injectable()
export class ContactDBSubject {

    private TAG = "SUBJECT";
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

    insert(sqlOb: SQLiteObject, sub: Subject) {
        return sqlOb.executeSql(this.query.INSERT, [sub.id, sub.name, sub.num])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + sub.name);
        })
        .catch(e => console.log(e));
    }

    update(sqlOb: SQLiteObject, sub: Subject) {
        return sqlOb.executeSql(this.query.UPDATE, [sub.name, sub.num, sub.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + sub.name);
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

    deleteById(sqlOb: SQLiteObject, id: string) {
        return sqlOb.executeSql(this.query.DELETE_BY_ID, [id])
        .then(res => {
            console.log(this.TAG + " DELETED BY ID: " + id);
        })
        .catch(e => console.log(e));
    }

    selectAll(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_ALL, {});
    }

    selectById(sqlOb: SQLiteObject, id: string): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_BY_ID, [id]);
    }

    selectJoinCat(sqlOb: SQLiteObject): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_JOIN_CAT, {});
    }    


    initDefaultData(sqlOb: SQLiteObject): Promise<Array<Subject>> {
        let pros = new Array<Promise<any>>();

        let subs: Array<Subject> = new Array();
        subs.push({id: "sp", name: "맞춤법",   num: 1});
        subs.push({id: "sl", name: "표준어",   num: 2});
        subs.push({id: "lw", name: "외래어",   num: 3});
        subs.push({id: "kr", name: "어휘",     num: 4});
        subs.push({id: "cc", name: "한자",     num: 5});
        subs.push({id: "c4", name: "한자성어", num: 6});
        subs.push({id: "ew", name: "영단어",   num: 7});

        subs.forEach(sub => {
            pros.push(this.insert(sqlOb, sub));
        });

        return Promise.all(pros).then(any => {
            return subs;
        });
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
            DELETE_BY_ID:       "DELETE FROM subject WHERE id=? ",
            SELECT_ALL:         "SELECT id, name, num "
                                    + " FROM subject "
                                    + " ORDER BY num",
            SELECT_BY_ID:       "SELECT id, name, num "
                                    + " FROM subject "
                                    + " WHERE id=? ",
            SELECT_JOIN_CAT:    "SELECT s.id, s.name, s.num, c.id as catId, c.name as catName, c.num as catNum, c.version as catVersion " 
                                    + " FROM subject s "
                                    + " LEFT JOIN category c ON s.id = c.subjectId "
                                    + " ORDER BY s.num, c.num"
        }
        
    }
}

interface query {
    CREATE_TABLE: string,
    DROP_TABLE: string,
    INSERT: string,
    UPDATE: string,
    DELETE: string,
    DELETE_BY_ID: string,
    SELECT_ALL: string,
    SELECT_BY_ID: string,
    SELECT_JOIN_CAT: string,
}