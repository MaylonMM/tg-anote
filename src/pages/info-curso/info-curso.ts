import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-info-curso',
  templateUrl: 'info-curso.html',
})
export class InfoCursoPage {

  curso: any = {};
  escola: any = {};
  periodos: any[] = [];
  nomeEscola: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.curso = this.navParams.get("curso");

    firebase.firestore().collection("escolas").doc(this.curso.data().escola).get()
    .then((doc) => {
      this.escola = doc
      this.nomeEscola = this.escola.data().nome;
    }).catch((erro) => {
      console.log(erro);
    });

    firebase.firestore().collection("periodos").where("curso", "==", this.curso.id).get()
    .then((data) => {
      this.periodos = data.docs;
    }).catch((erro) => {
      console.log(erro);
    });
  }

  ionViewDidLoad(){

  }

  alterar() {
    this.navCtrl.push('CadCursoPage', {
      curso: this.curso,
      escola: this.nomeEscola,
      periodos: this.periodos
    })
  }

  deletar() {
    console.log("Entrou no deletar");
    this.alertCtrl.create({
      title: "Cuidado",
      message: "Você REALMENTE deseja excluir esses dados?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            firebase.firestore().collection("cursos").doc(this.curso.id).delete()
            .then(() => {
              firebase.firestore().collection("periodos").where("curso", "==", this.curso.id).get()
              .then((data) => {
                data.docs.forEach((doc) => {
                  firebase.firestore().collection("periodos").doc(doc.id).delete()
                  .then(() => {
                    console.log("periodo deletado");
                  }).catch((erro) => {
                    console.log(erro);
                  });
                })
              }).catch((erro) => {
                console.log(erro);
              });

              this.navCtrl.setRoot('CursosPage');

              this.toastCtrl.create({
                message: "Curso excluido com sucesso.",
                duration: 3000
              }).present();
            }).catch(() => {
              this.toastCtrl.create({
                message: "Não foi possivel excluir o curso.",
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();

  }
}
