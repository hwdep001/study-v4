
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// add
import { App } from 'ionic-angular/components/app/app';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

// firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

// providers

// models
import { MenuTitleInterface } from '../models/menu/MenuTitleInterface';
import { PageInterface } from './../models/menu/PageInterface';
import { User } from '../models/User';


// pages
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { UserService } from '../providers/user-service';
import { TestPage } from '../pages/test/test';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  lastBack: any;  // for backbutton

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

    private user_: UserService
  ) {
    this.initializeApp();
    this.initializeMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.platform.registerBackButtonAction(() => this.exitApp());
      this.splashScreen.hide();
    });
  }

  initializeMenu() {
    this.user = new User();
    this.user.uid = "asdasdasdasdsad";
    this.user.name = "hw dep";
    this.user.email = "hwdep001@gmail.com";
    this.user.photoURL = "https://lh3.googleusercontent.com/-ZR6V6a6j2xA/AAAAAAAAAAI/AAAAAAAAAAA/ANQ0kf7uYuhJcipdWgVf-ZtAgNuZxG4Eng/s96-c/photo.jpg";
    this.user.isSignIn = false;
    this.user.isAuth = false;

    this.setPages();

    if(this.user.isSignIn && this.user.isAuth) {
      this.rootPage = HomePage
    } else if(!this.user.isSignIn || !this.user.isAuth) {
      this.rootPage = SigninPage
    }
  }

  setPages() {
    const homePage: PageInterface = { title: '대시보드', name: 'HomePage',  component: HomePage, icon: 'home' };
    const tabsPage: PageInterface = { title: 'Tabs', name: 'TabsPage', component: TestPage, icon: 'home'};
    // const ewPage: PageInterface = { title: '영단어', name: 'EwPage',  component: CatListPage, param: {activeName: "EwPage", key: "ew"}, icon: 'book' };
    // const lwPage: PageInterface = { title: '외래어', name: 'LwPage',  component: CatListPage, param: {activeName: "LwPage", key: "lw"}, icon: 'book' };
    // const ciPage: PageInterface = { title: '한자성어', name: 'CiPage',  component: CatListPage, param: {activeName: "CiPage", key: "ci"}, icon: 'book' };
    // const ccPage: PageInterface = { title: '한자', name: 'CcPage',  component: CatListPage, param: {activeName: "CcPage", key: "cc"}, icon: 'book' };
    // const userInfoPage: PageInterface = { title: '내 정보', name: 'UserInfoPage', component: UserInfoPage, icon: 'information-circle'};

    if(this.user.isAvailable()){
      this.navigatePages = [];
      this.navigatePages.push(homePage);
      this.navigatePages.push(tabsPage);

      this.studyPages = [];
      // this.studyPages.push(ewPage);
      // this.studyPages.push(lwPage);
      // this.studyPages.push(ciPage);
      // this.studyPages.push(ccPage);

      this.accountPages = [];
    }

    this.menuTitle.header = "Menu";
    this.menuTitle.navigate = "Navigate";
    this.menuTitle.study = "Study";
    this.menuTitle.admin = "Navigate";
    this.menuTitle.account = "Account";
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

  openPage(page) {
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
