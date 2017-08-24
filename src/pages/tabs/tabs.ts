import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = 'DiscoverPage';
  tab2Root: any = 'FeedPage';
  tab3Root: any = 'UploadPage';
  tab4Root: any = 'ProfilePage';
  mySelectedIndex: number;
  isLoggedIn;

  constructor(navParams: NavParams, public authHelperProvider: AuthHelperProvider) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.authHelperProvider.isLoggedIn().then((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

}
