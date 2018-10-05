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
  userCred: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidLoad() {
    console.log('Entrou na LoginPage');
    // Fazer um teste de colocar novamente o observador
    // do usuario aqui para ver se o observador é desligado
    // quando se está em outra pagina.
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
        console.log(user);

        this.toastCtrl.create({
          message: "Bem vindo, " + user.user.displayName + "!",
          duration: 3000
        }).present();
        // Direcionamento feito pelo observador em app.component.ts

      }).catch((err) => {
        console.log(err)
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      });

  }

}
