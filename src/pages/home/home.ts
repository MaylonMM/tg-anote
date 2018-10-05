import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userName: string = "";

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    if(firebase.auth().currentUser == null) {
      this.userName = "desconhecido";
      console.log("Entrou no desconhecido");
    } else {
      this.userName = firebase.auth().currentUser.displayName;
      console.log("Entrou no conhecido" + firebase.auth().currentUser);
    }
  }

  logout() {
    if(firebase.auth().currentUser != null) {
      firebase.auth().signOut()
      .then(() => {
        this.toastCtrl.create({
          message: "Você se desconectou com sucesso.",
          duration: 3000
        }).present();

        this.navCtrl.setRoot('LoginPage');
      }).catch(() => {
        this.toastCtrl.create({
          message: "Erro ao tentar desconectar.",
          duration: 3000
        }).present();
      });
    } else {
      this.navCtrl.setRoot('LoginPage');
    }
  }

}
