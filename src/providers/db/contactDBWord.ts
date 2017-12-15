import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { CommonUtil } from '../../utils/commonUtil';
import { Word } from './../../models/Word';

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

    insert(sqlOb: SQLiteObject, word: Word) {
        return sqlOb.executeSql(this.query.INSERT, [
            word.id, 
            word.num, 
            word.lectureId, 
            word.que,
            word.me1,
            word.me2,
            word.me3,
            word.me4,
            word.me5,
            word.me6,
            word.me7,
            word.me8,
            word.me9,
            word.me10,
            word.me11,
            word.me12,
            word.me13,
            word.syn,
            word.ant
        ]).then(res => {
            console.log(this.TAG + " INSERTED: " + word.que);
        })
        .catch(e => console.log(e));
    }

    updateWithOutLevel(sqlOb: SQLiteObject, word: Word) {
        return sqlOb.executeSql(this.query.UPDATE_WITHOUT_LEVEL,[
            word.num, 
            word.lectureId, 
            word.que,
            word.me1,
            word.me2,
            word.me3,
            word.me4,
            word.me5,
            word.me6,
            word.me7,
            word.me8,
            word.me9,
            word.me10,
            word.me11,
            word.me12,
            word.me13,
            word.syn,
            word.ant,
            word.id
        ]).then(res => {
            console.log(this.TAG + " UPDATED: " + word.que);
        })
        .catch(e => console.log(e));
    }

    updateAllLevel(sqlOb: SQLiteObject, levelId: number) {
        return sqlOb.executeSql(this.query.UPDATE_ALL_LEVEL, [levelId])
        .then(res => {
            console.log(this.TAG + " UPDATED ALL LEVEL: " + levelId);
        })
        .catch(e => console.log(e));
    }

    updateLevel(sqlOb: SQLiteObject, id: string, levelId: number) {
        return sqlOb.executeSql(this.query.UPDATE_LEVEL, [levelId, id])
        .then(res => {
            console.log(this.TAG + " UPDATED LEVEL: " + id + " -> " + levelId);
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
        return sqlOb.executeSql(this.query.DELETE_BY_ID, 
            [id])
        .then(res => {
            console.log(this.TAG + " DELETED: " + id);
        })
        .catch(e => console.log(e));
    }

    selectByLecId(sqlOb: SQLiteObject, lecId: string): Promise<any> {
        return sqlOb.executeSql(this.query.SELECT_BY_LECTURE, [lecId]);
    }

    selectBySearch(sqlOb: SQLiteObject, lecIds: Array<string>, levIds: Array<number>,
                    count: number, isRandom: boolean): Promise<any> {
        let sql = this.query.SELECT_BY_SEARCH;
        let params = [];
        let where_lec = " AND w.lectureId IN (" 
                        + CommonUtil.getQForSqlInSyntax(lecIds.length) + ") ";
        let where_lev = " AND w.levelId IN ("
                        + CommonUtil.getQForSqlInSyntax(levIds.length) + ") ";

        if(lecIds.length > 0) {
            sql = sql.replace("{{WHERE_LEC}}", where_lec);
            params.pushArray(lecIds);
        } else {
            sql = sql.replace("{{WHERE_LEC}}", "");
        }

        if(levIds.length > 0) {
            sql = sql.replace("{{WHERE_LEV}}", where_lev);
            params.pushArray(levIds);
        } else {
            sql = sql.replace("{{WHERE_LEV}}", "");
        }

        if(isRandom) {
            sql = sql.replace("{{ORDER_BY}}", "RANDOM()");
        } else {
            sql = sql.replace("{{ORDER_BY}}", "w.num");
        }

        if(count > 0) {
            sql = sql.replace("{{LIMIT}}", "LIMIT ?");
            params.push(count);
        } else {
            sql = sql.replace("{{LIMIT}}", "");
        }

        return sqlOb.executeSql(sql, params);
    }

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS word ("
                                    + "id VARCHAR(32),"
                                    + "num INT,"
                                    + "lectureId VARCHAR(32), "
                                    + "levelId INT2 DEFAULT 0, "
                                    +  "que TEXT,"
                                    +  "me1 TEXT,"
                                    +  "me2 TEXT,"
                                    +  "me3 TEXT,"
                                    +  "me4 TEXT,"
                                    +  "me5 TEXT,"
                                    +  "me6 TEXT,"
                                    +  "me7 TEXT,"
                                    +  "me8 TEXT,"
                                    +  "me9 TEXT,"
                                    + "me10 TEXT,"
                                    + "me11 TEXT,"
                                    + "me12 TEXT,"
                                    + "me13 TEXT,"
                                    +  "syn TEXT,"
                                    +  "ant TEXT,"
                                    + " PRIMARY KEY (id), "
                                    + " FOREIGN KEY (lectureId) "
                                    + " REFERENCES lecture (id) ON DELETE CASCADE, "
                                    + " FOREIGN KEY (levelId) "
                                    + " REFERENCES level (levelId) ON DELETE SET DEFAULT "
                                    + ")",
            DROP_TABLE:         "DROP TABLE IF EXISTS word",
            INSERT:             "INSERT INTO word "
                                    + " (id, num, lectureId, levelId, que, me1, me2, me3, me4, me5, me6, " 
                                    +  " me7, me8, me9, me10, me11, me12, me13, syn, ant) "
                                    + " VALUES(?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
            UPDATE_WITHOUT_LEVEL: 
                                "UPDATE word "
                                    + " SET num=?, lectureId=?, que=?, me1=?, me2=?, me3=?, me4=?, me5=?, me6=?, "
                                    +     " me7=?, me8=?, me9=?, me10=?, me11=?, me12=?, me13=?, syn=?, ant=? "
                                    + " WHERE id=? ",
            UPDATE_ALL_LEVEL:   "UPDATE word "
                                    + " SET levelId=? ",
            UPDATE_LEVEL:       "UPDATE word "
                                    + " SET levelId=? "
                                    + " WHERE id=? ",
            DELETE:             "DELETE FROM word ",
            DELETE_BY_ID:       "DELETE FROM word WHERE id=?",
            SELECT_BY_LECTURE:  "SELECT id, num, lectureId, levelId, que, me1, me2, me3, me4, me5, me6, me7, "
                                    + " me8, me9, me10, me11, me12, me13, syn, ant"
                                    + " FROM word "
                                    + " WHERE lectureId=? "
                                    + " ORDER BY num",
            SELECT_BY_SEARCH:   "SELECT w.id, w.num, w.lectureId, w.levelId, w.que, w.me1, w.me2, w.me3, w.me4, " 
                                    + " w.me5, w.me6, w.me7, w.me8, w.me9, w.me10, w.me11, w.me12, w.me13, w.syn, w.ant, "
                                    + " l.name as lectureName "
                                    + " FROM word w "
                                    + " LEFT JOIN lecture l ON w.lectureId = l.id "
                                    + " WHERE 1=1 "
                                    + " {{WHERE_LEC}} {{WHERE_LEV}} "
                                    + " ORDER BY {{ORDER_BY}} "
                                    + " {{LIMIT}} ",
        }
        
    }
}

interface query {
    CREATE_TABLE: string,
    DROP_TABLE: string,
    INSERT: string,
    UPDATE_WITHOUT_LEVEL: string,
    UPDATE_ALL_LEVEL: string,
    UPDATE_LEVEL: string,
    DELETE: string,
    DELETE_BY_ID: string,
    SELECT_BY_LECTURE: string,
    SELECT_BY_SEARCH: string,
}