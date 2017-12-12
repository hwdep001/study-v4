import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// add
import { App } from 'ionic-angular/components/app/app';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

// firebase
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';  // delete X

// providers
import { CommonUtil } from './../utils/commonUtil';
import { CommonService } from '../providers/common-service';
import { DBHelper } from '../providers/db-helper';
import { TestService } from '../providers/test-service';

// models
import { MenuTitleInterface } from '../models/menu/MenuTitleInterface';
import { PageInterface } from './../models/menu/PageInterface';
import { User } from '../models/User';

// pages
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { TestPage } from '../pages/test/test';
import { CatListPage } from './../pages/cat-list/cat-list';
import { SettingPage } from '../pages/setting/setting';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  lastBack: any;  // for backbutton

  usersRef: firebase.firestore.CollectionReference;
  user: User;

  pages: Array<{title: string, component: any}>;
  navigatePages: PageInterface[];
  studyPages: PageInterface[];
  accountPages: PageInterface[];
  menuTitle: MenuTitleInterface = {
    header: null,
    navigate: null,
    admin: null,
    study: null,
    account: null
  }

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,

    private app: App,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,

    private afAuth: AngularFireAuth,
    private cmn_: CommonService,
    private dbHelper: DBHelper,
    private test_: TestService
  ) {
    this.usersRef = firebase.firestore().collection("users");
    this.initializeApp();
    this.subscribeAuth();
    CommonUtil.void();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.platform.registerBackButtonAction(() => this.exitApp());
      this.splashScreen.hide();
      this.savePlatform();
      this.dbHelper.getSQLiteObject();
    });
  }

  subscribeAuth() {
    firebase.auth().onAuthStateChanged(fireUser => {
      this.user = CommonUtil.fireUser2user(fireUser);

      if(fireUser != null) {
        this.usersRef.where("uid", "==", this.user.uid).get().then(querySnapshot => {
          if(querySnapshot.size > 0) {
            this.usersRef.doc(this.user.uid).update(this.user.user2ObjectForUpdate());
          } else {
            this.usersRef.doc(this.user.uid).set(this.user.user2ObjectForSet());
          }
          querySnapshot.forEach(doc => {
            this.cmn_.setUser(doc.data());
          });
        });
      }
      this.initializeMenu(fireUser);
    });
  }

  initializeMenu(fireUser: firebase.User) {
    this.setPages();

    if(this.user != null) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = SigninPage;
    }
  }

  setPages() {
    const homePage: PageInterface = { title: '대시보드', name: 'HomePage',  component: HomePage, icon: 'home' };
    const tabsPage: PageInterface = { title: 'Tabs', name: 'TabsPage', component: TestPage, icon: 'home'};
    const spPage: PageInterface = { title: '맞춤법',   name: 'SpPage',  component: CatListPage, param: {activeName: "SpPage", id: "sp"}, icon: 'book' };
    const slPage: PageInterface = { title: '표준어',   name: 'SlPage',  component: CatListPage, param: {activeName: "SlPage", id: "sl"}, icon: 'book' };
    const lwPage: PageInterface = { title: '외래어',   name: 'LwPage',  component: CatListPage, param: {activeName: "LwPage", id: "lw"}, icon: 'book' };
    const krPage: PageInterface = { title: '어휘',     name: 'KrPage',  component: CatListPage, param: {activeName: "KrPage", id: "kr"}, icon: 'book' };
    const ccPage: PageInterface = { title: '한자',     name: 'CcPage',  component: CatListPage, param: {activeName: "CcPage", id: "cc"}, icon: 'book' };
    const c4Page: PageInterface = { title: '한자성어', name: 'C4Page',  component: CatListPage, param: {activeName: "C4Page", id: "c4"}, icon: 'book' };
    const ewPage: PageInterface = { title: '영단어',   name: 'EwPage',  component: CatListPage, param: {activeName: "EwPage", id: "ew"}, icon: 'book' };
    const settingPage: PageInterface = { title: '설정', name: 'SettingPage', component: SettingPage, icon: 'settings'};

    if(this.user != null){
      this.navigatePages = [];
      this.navigatePages.push(homePage);
      this.navigatePages.push(tabsPage);

      this.studyPages = [];
      this.studyPages.push(spPage);
      this.studyPages.push(slPage);
      this.studyPages.push(lwPage);
      this.studyPages.push(krPage);
      this.studyPages.push(ccPage);
      this.studyPages.push(c4Page);
      this.studyPages.push(ewPage);

      this.accountPages = [];
      this.accountPages.push(settingPage);
    }

    this.menuTitle.header = "Menu";
    this.menuTitle.navigate = "Navigate";
    this.menuTitle.study = "Study";
    this.menuTitle.admin = "Navigate";
    this.menuTitle.account = "Account";
  }

  savePlatform() {
    
    let thisPlatform = null;

    if(this.platform.is('browser')) {
      thisPlatform = "browser";
    } else if (this.platform.is('core')) {
      thisPlatform = "core";
    } else if (this.platform.is('android')) {
      thisPlatform = "android";
    } else if (this.platform.is('ios')) {
      thisPlatform = "ios";
    }

    this.test_.platform = thisPlatform;
    console.log("MyApp - Current platform: " + thisPlatform);
  }

  private exitApp() {
    
    const overlay = this.app._appRoot._overlayPortal.getActive();
    const nav = this.app.getActiveNavs()[0];

    if(this.menuCtrl.isOpen()) {
      this.menuCtrl.close();
    }else if(overlay && overlay.dismiss) {
      overlay.dismiss();
    } else if(nav.getActive().name == "WordCardPage"){
      this.showConfirmAlert("목록으로 돌아가시겠습니까?", ()=> {
        nav.pop();  
      });
    } else if(nav.canGoBack()){
      nav.pop();
    } else if(Date.now() - this.lastBack < 500) {
      this.showConfirmAlert("EXIT?", () => {
        this.platform.exitApp();
      });
    }
    this.lastBack = Date.now();
  }

  openPage(page: PageInterface) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, page.param);
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive()) {
      if(this.nav.getActive().name === page.name) {
        return 'primary';
      } else if(this.nav.getActive().getNavParams().get("activeName") == page.name) {
        return 'primary';
      }
    }
    return;
  }

  showConfirmAlert(message: string, yesHandler) {
    let confirm = this.alertCtrl.create({
      message: message,
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            yesHandler();
          }
        }
      ]
    });
    confirm.present();
  }
}
