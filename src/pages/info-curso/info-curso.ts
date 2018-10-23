import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';
import moment from 'moment';

import { Curso } from '../../models/curso.model';
import { Periodo } from '../../models/periodo.model';

@IonicPage()
@Component({
  selector: 'page-info-curso',
  templateUrl: 'info-curso.html',
})
export class InfoCursoPage {

  curso: Curso;
  periodos: Periodo[];
  startDate: string;
  endDate: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    moment.locale('pt-BR');
    this.curso = new Curso;
    this.periodos = [];
    this.startDate = "";
    this.endDate = "";
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let dadosCurso = this.navParams.get("curso");

    if(dadosCurso != undefined) {
      this.curso = dadosCurso;
      this.startDate = moment(this.curso.dataInicio).add(moment(this.curso.dataInicio).utcOffset() * -1, "m").format("L LT");
      this.endDate = moment(this.curso.dataFinalizacao).add(moment(this.curso.dataInicio).utcOffset() * -1, "m").format("L LT");

      let loading = this.loadingCtrl.create({
        content: "Carregando..."
      });
      loading.present();

      firebase.firestore().collection("periodos")
      .where("curso", "==", this.curso.id)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.periodos = [];
        data.docs.forEach((periodo) => {
          this.periodos.push({
            nome: periodo.data().nome,
            sigla: periodo.data().sigla,
            tipo: periodo.data().tipo,
            user: periodo.data().user,
            curso: periodo.data().curso,
            id: periodo.id
          });
        });
        loading.dismiss();
      }).catch((erro) => {
        console.log(erro);
        loading.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
      });
    }
  }

  alterar() {
    this.navCtrl.push('CadCursoPage', {
      curso: this.curso,
      periodos: this.periodos
    })
  }

  deletar() {
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
            let loading = this.loadingCtrl.create({
              content: "Deletando..."
            });
            loading.present();

            firebase.firestore().collection("cursos").doc(this.curso.id).delete()
            .then(() => {
              this.periodos.forEach((periodo) => {
                firebase.firestore().collection("periodos").doc(periodo.id).delete()
                .then(() => {

                }).catch((erro) => {
                  console.log(erro);
                  loading.dismiss();
                  this.toastCtrl.create({
                    message: "Ocorreu um erro inesperado. :(",
                    duration: 3000
                  }).present();
                });
              });
              this.navCtrl.setRoot('CursosPage');
              loading.dismiss();
              this.toastCtrl.create({
                message: "Curso excluído.",
                duration: 3000
              }).present();
            }).catch((erro) => {
              console.log(erro);
              loading.dismiss();
              this.toastCtrl.create({
                message: "Ocorreu um erro inesperado. :(",
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();

  }

  voltar() {
    if(this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }
}
