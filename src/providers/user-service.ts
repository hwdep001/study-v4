import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable()
export class UserService {

    private user_: User = new User();

    get user(): User {
        return this.user_;
    }

    get uid(): string {
        return this.user_.uid;
    }

    get displayName(): string {
        return this.user_.displayName;
    }

    get email(): string {
        return this.user_.email;
    }

    get photoURL(): string {
        return this.user_.photoURL;
    }

    get createDate(): string {
        return this.user_.createDate;
    }

    get lastDate(): string {
        return this.user_.lastDate;
    }

    get isAuth(): boolean {
        return this.user_.isAuth;
    }

    get isDel(): boolean {
        return this.user_.isDel;
    }

    setUser(user) {
        this.user_ = new User();
        this.user_.uid = user.uid;
        this.user_.displayName = user.displayName;
        this.user_.email = user.email;
        this.user_.photoURL = user.photoURL;
        this.user_.createDate = user.createDate;
        this.user_.lastDate = user.lastDate;
        this.user_.isAuth = user.isAuth;
        this.user_.isDel = user.isDel;
    }
}