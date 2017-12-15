import * as firebase from 'firebase/app';
import { User } from './../models/User';

declare global {
    interface Date {
        yyMMdd(): string;
        yyyy_MM_dd_HH_mm_ss (): string;
    }

    interface Array<T> {
        pushArray(array: Array<T>): void;
        shuffleArray(): void;
    }
}

/**
 * yyMMdd
 */
Date.prototype.yyMMdd = function(): string {
    var yy = this.getFullYear().toString().slice(2, 4);
    var MM = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [yy,
            (MM>9 ? '' : '0') + MM,
            (dd>9 ? '' : '0') + dd
            ].join('');
};

/**
 * yyyy-MM-dd HH:mm:ss
 */
Date.prototype.yyyy_MM_dd_HH_mm_ss = function(): string {
    var yyyy = this.getFullYear();
    var MM = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var HH = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return [yyyy, "-",
            (MM>9 ? '' : '0') + MM, "-",
            (dd>9 ? '' : '0') + dd, " ",
            (HH>9 ? '' : '0') + HH, ":",
            (mm>9 ? '' : '0') + mm, ":",
            (ss>9 ? '' : '0') + ss
            ].join('');
};

Array.prototype.pushArray = function(array) {
    this.push.apply(this, array);
};

Array.prototype.shuffleArray = function() {
    let m = this.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);

        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }
};

export class CommonUtil {

    public static void(): void {};

    public static fireUser2user(fireUser: firebase.User): User {
        let user: User = null;

        if(fireUser != null) {
            user = new User();
            user.uid = fireUser.uid;
            user.email = fireUser.email;
            user.displayName = fireUser.displayName;
            user.photoURL = fireUser.photoURL;
        }

        return user;
    }

    public static getActiveName(param: string): string {
        let result: string;
        switch(param) {
            case "ew":
                result = "EwPage";
                break;
            case "lw":
                result = "LwPage";
                break;
            case "setting":
                result = "SettingPage";
                break;
        }
    
        return result;
    }

    public static getQForSqlInSyntax(count: number): string {
        let result = "";

        for(let i=0; i<count; i++) {
            result += "?";

            if(i < count-1) {
                result += ",";
            }
        }

        return result;
    }
}