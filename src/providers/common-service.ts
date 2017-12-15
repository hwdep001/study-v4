import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import { Loading } from 'ionic-angular/components/loading/loading';
import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { User } from '../models/User';

@Injectable()
export class CommonService {

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) {
    
    }

    private user_: User = new User();
    
    get user(): User {
        return this.user_;
    }

    get uid(): string {
        return this.existUser? this.user_.uid : null;
    }

    get displayName(): string {
        return this.existUser? this.user_.displayName : null;
    }

    get email(): string {
        return this.existUser? this.user_.email : null;
    }

    get photoURL(): string {
        return this.existUser? this.user_.photoURL : null;
    }

    get createDate(): string {
        return this.existUser? this.user_.createDate : null;
    }

    get lastDate(): string {
        return this.existUser? this.user_.lastDate : null;
    }

    get isAuth(): boolean {
        return this.existUser? this.user_.isAuth : false;
    }

    get isDel(): boolean {
        return this.existUser? this.user_.isDel : false;
    }

    get ad(): boolean {
        return true;
    }

    get existUser(): boolean {
        return this.user_ == null ? false: true;
    }

    setIsDel(isDel: boolean): void {
        this.user.isDel = isDel;
    }

    setUser(user) {

        if(user == null) {
            this.user_ = null;
        } else {
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

    getLoader(spinner: string, content: string, duration?: number, dismissOnPageChange?: boolean): Loading {
        spinner = spinner ? spinner : "bubbles";
        content = content ? content : "Please wait...";
        duration = duration ? duration : 15000;
        dismissOnPageChange = dismissOnPageChange == true ? true : false;
        
        return this.loadingCtrl.create({
          spinner: spinner,
          content: content,
          duration: duration,
          dismissOnPageChange: dismissOnPageChange
        });
    }

    public Alert = {
        confirm: (msg?, title?) => {
          return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
              title: title || 'Confirm',
              message: msg || 'Do you want continue?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    reject(false);
                  }
                },
                {
                  text: 'Ok',
                  handler: () => {
                    resolve(true);
                  }
                }
              ]
            });
            alert.present();
          });
    
        },
        alert: (msg, title?) => {
          let alert = this.alertCtrl.create({
            title: title || 'Alert',
            subTitle: msg,
            buttons: ['Close']
          });
    
          alert.present();
        }
    }

    public Toast = {
        present: (
            position: string, 
            message: string, 
            cssClass: string, 
            duration?: number) => {

                let options: ToastOptions = {
                    message: message,
                    position: position,
                    duration: (duration == null) ? 2500 : duration
                }
                if(cssClass != null) {
                    options.cssClass = cssClass;
                }

                this.toastCtrl.create(options).present();
        }
    }
}