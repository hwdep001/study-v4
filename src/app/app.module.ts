import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite'
import { MyApp } from './app.component';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// environments
import { environment } from './../environments/environment';

// providers
import { CommonService } from './../providers/common-service';
import { DBHelper } from '../providers/db-helper';
import { ContactDBSubject } from './../providers/db/contactDBSubject';

import { TestService } from '../providers/test-service';

// pages
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { TestPage } from './../pages/test/test';
  import { Tab1Page } from '../pages/test/tab1/tab1';
import { SettingPage } from '../pages/setting/setting';
  import { WordMngPage } from './../pages/setting/word-setting/word-mng';
  
@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    HomePage,
    TestPage,
      Tab1Page,
    SettingPage,
      WordMngPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    HomePage,
    TestPage,
      Tab1Page,
    SettingPage,
      WordMngPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    DBHelper,
    ContactDBSubject,
    TestService
  ]
})
export class AppModule {}
