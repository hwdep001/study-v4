import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User } from '../models/User';
import { UserService } from './user-service';

@Injectable()
export class DBHelper {

    constructor(
      private user_: UserService
    ) {
      this.initializeTable();
    }

    initializeTable() {
      this.user_.createTable();
    }

    dropTables() {
      this.user_.dropTable();
    }

}