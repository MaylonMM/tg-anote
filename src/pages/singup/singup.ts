import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-singup',
  templateUrl: 'singup.html',
})
export class SingupPage {

  nome: string = "";
  email: string = "";
  senha: string = "";
  senhaRepete: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingupPage');
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(true);
  }

  goLogin() {
    this.navCtrl.pop();
  }

  singup() {
    if(this.senha == this.senhaRepete) {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.senha)
      .then((data) => {
        console.log(data);

        let newUser: firebase.User = data.user;
        newUser.updateProfile({
          displayName: this.nome,
          photoURL: ""
        })
        .then(() => {
          console.log("Profile Updated")

          this.alertCtrl.create({
            title: "Conta criada",
            message: "Sua conta foi criada com sucesso!",
            buttons: [
              {
                text: "OK",
                handler: () => {
                  this.navCtrl.setRoot('HomePage');
                }
              }
            ]
          }).present();

        }).catch((err) => {
          console.log(err);
        })

      }).catch((err) => {
        console.log(err)
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      })
    } else {
      this.senha = "";
      this.senhaRepete = "";

      this.toastCtrl.create({
        message: "A senha está incorreta",
        duration: 3000
      }).present();
    }


  }

}
