import { Component } from '@angular/core';

import { InfoPage } from './info/info';
import { WordMngPage } from './word-mng/word-mng';

@Component({
  selector: 'page-settingTab',
  templateUrl: 'setting-tab.html',
})
export class SettingTabPage {

  tab1Root: any = InfoPage;
  tab2Root: any = WordMngPage;

  constructor() {
  }

}