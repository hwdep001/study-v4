import { Component } from '@angular/core';

import { Tab1Page } from './tab1/tab1';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  tab1Root: any = Tab1Page;

  constructor() {
  }

}
