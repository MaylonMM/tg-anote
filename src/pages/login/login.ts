import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string = "";
  senha: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(true);
  }

  goSignup() {
    this.navCtrl.push('SingupPage');
  }

  login() {
    firebase.auth().signInWithEmailAndPassword(this.email, this.senha)
      .then((user) => {
        console.log(user)

        this.toastCtrl.create({
          message: "Welcome " + user.user.displayName,
          duration: 3000
        }).present();

        this.navCtrl.setRoot('HomePage');

      }).catch((err) => {
        console.log(err)
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      })
  }

}
