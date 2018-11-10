import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-load',
  templateUrl: 'load.html',
})
export class LoadPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController
  ) {
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(true);
  }

}
