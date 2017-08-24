import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthHelperProvider } from '../providers/auth-helper/auth-helper';
import { Storage } from '@ionic/storage';
import { HeaderColor } from '@ionic-native/header-color';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage;
  isAuthenticated = false;

  profilePage = { title: 'Profile', icon: 'person', index: 0 };
  discoverPage = { title: 'Discover', name: 'TabsPage', tabComponent: 'DiscoverPage', index: 0, icon: 'photos' };

  logoutNavPages = [
    this.discoverPage
  ];

  logoutAccountPages = [
    { title: 'Login', name: 'LoginPage', icon: 'log-in' },
    { title: 'Signup', name: 'RegisterPage', icon: 'person-add' }
  ];

  loginNavPages = [
    { title: 'Discover', name: 'TabsPage', tabComponent: 'DiscoverPage', index: 0, icon: 'calendar' },
    { title: 'Feed', name: 'TabsPage', tabComponent: 'FeedPage', index: 1, icon: 'images' },
    { title: 'Upload', name: 'TabsPage', tabComponent: 'UploadPage', index: 2, icon: 'cloud-upload' }];

  loginAccountPages = [
    { title: 'Profile', name: 'TabsPage', tabComponent: 'ProfilePage', index: 3, icon: 'person' },
    { title: 'Logout', name: 'TabsPage', logsOut: true, icon: 'log-out' }
  ];

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public menu: MenuController,
              public authHelperProvider: AuthHelperProvider,
              public storage: Storage,
              public headerColor: HeaderColor) {
    this.storage.get('hasSeenTutorial').then((hasSeenTutorial) => {
      if (hasSeenTutorial) {
        this.rootPage = 'TabsPage';
      } else {
        this.rootPage = 'TutorialPage';
      }
      this.platformReady();
      this.listenToLoginEvents();
      this.authHelperProvider.isLoggedIn().then((isLoggedIn) => {
        this.isAuthenticated = isLoggedIn;
      });
    }).catch((err) => {
      console.log('err', err);
    });

  }

  openPage(page) {
    let params = {};

    if (page.index) {
      params = { tabIndex: page.index };
    }

    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      this.authHelperProvider.logout();
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.isAuthenticated = true;
    });

    this.events.subscribe('user:logout', () => {
      this.isAuthenticated = false;
    });
  }

  isActive(page) {
    let childNav = this.nav.getActiveChildNavs()[0];

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'secondary';
      }
      return '';
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'secondary';
    }
    return '';
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#263238');
      this.headerColor.tint('#263238');
      this.splashScreen.hide();
    });
  }

}

