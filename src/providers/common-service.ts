import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

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

    getLoader(spinner: string, content: string, duration?: number, dismissOnPageChange?: boolean) {
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