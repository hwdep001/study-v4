import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
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
        return sqlOb.executeSql(this.query.INSERT, 
            [word.id, word.head1, word.head2, word.body1, word.body2, 
                word.num, word.lectureId, word.levelId])
        .then(res => {
            console.log(this.TAG + " INSERTED: " + word.head1);
        })
        .catch(e => console.log(e));
    }

    updateWithOutLevel(sqlOb: SQLiteObject, word: Word) {
        return sqlOb.executeSql(this.query.UPDATE_WITHOUT_LEVEL, 
            [word.head1, word.head2, word.body1, word.body2, 
                word.num, word.lectureId, word.id])
        .then(res => {
            console.log(this.TAG + " UPDATED: " + word.head1);
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

    

    private initQuery() {
        this.query = {
            CREATE_TABLE:       "CREATE TABLE IF NOT EXISTS word ("
                                    + "id VARCHAR(32),"
                                    + "head1 VARCHAR(64),"
                                    + "head2 VARCHAR(64),"
                                    + "body1 TEXT,"
                                    + "body2 TEXT,"
                                    + "num INT,"
                                    + "lectureId VARCHAR(32), "
                                    + "levelId INT2 DEFAULT 0, "
                                    + " PRIMARY KEY (id), "
                                    + " FOREIGN KEY (lectureId) "
                                    + " REFERENCES lecture (id) ON DELETE CASCADE, "
                                    + " FOREIGN KEY (levelId) "
                                    + " REFERENCES level (levelId) ON DELETE SET DEFAULT "
                                    + ")",
            DROP_TABLE:         "DROP TABLE IF EXISTS word",
            INSERT:             "INSERT INTO word "
                                    + " (id, head1, head2, body1, body2, num, lectureId, levelId) "
                                    + " VALUES(?, ?, ?, ?, ?, ?, ?, ?) ",
            UPDATE_WITHOUT_LEVEL: 
                                "UPDATE word "
                                    + " SET head1=?, head2=?, body1=-1, body2=?, num=?, lectureId=? "
                                    + " WHERE id=? ",
            DELETE:             "DELETE FROM word ",
            DELETE_BY_ID:       "DELETE FROM word WHERE id=?",
            SELECT_BY_LECTURE:  "SELECT id, head1, head2, body1, body2, num, lectureId, levelId "
                                    + " FROM word "
                                    + " WHERE lectureId=? "
                                    + " ORDER BY num",
        }
        
    }
}

interface query {
    CREATE_TABLE?: string,
    DROP_TABLE?: string,
    INSERT?: string,
    UPDATE_WITHOUT_LEVEL?: string,
    DELETE?: string,
    DELETE_BY_ID?: string,
    SELECT_BY_LECTURE?: string,
}