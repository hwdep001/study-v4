import { environment } from './../environments/environment';
import { User } from './../models/User';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { UserService } from './user-service';



@Injectable()
export class TestService {

    platform: string;

    constructor(
        private user_: UserService
    ) {
    }

}