import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';

import { Escola } from '../../models/escola.model';
import { SelectOpt } from '../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-cad-escola',
  templateUrl: 'cad-escola.html',
})
export class CadEscolaPage {

  uid: string;
  escola: Escola;
  edit: boolean;
  estados: string[];
  selectOptEstado: SelectOpt;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.uid = "";
    this.escola = new Escola();
    this.edit = false;
    this.estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
    this.selectOptEstado = { title: "Estados", subTitle: "Selecione um estado" }
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosEscola = this.navParams.get("escola");

    if(user != null) {
      this.uid = user.uid;
    }

    if(dadosEscola != undefined) {
      this.edit = true;
      this.escola = dadosEscola;
    }
  }

  salvar() {
    if(this.edit) {
      this.atualizar();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("escolas").add({
        nome: this.escola.nome,
        sigla: this.escola.sigla,
        telefone: this.escola.telefone,
        email: this.escola.email,
        endereco: this.escola.endereco,
        cidade: this.escola.cidade,
        estado: this.escola.estado,
        user: this.uid
      }).then(() => {
        this.voltar();
        loading.dismiss();
        this.toastCtrl.create({
          message: "Escola cadastrada! :)",
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

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando..."
    });
    loading.present();

    firebase.firestore().collection("escolas").doc(this.escola.id).update({
      nome: this.escola.nome,
        sigla: this.escola.sigla,
        telefone: this.escola.telefone,
        email: this.escola.email,
        endereco: this.escola.endereco,
        cidade: this.escola.cidade,
        estado: this.escola.estado
    }).then(() => {
      this.voltar();
      loading.dismiss();
      this.toastCtrl.create({
        message: "Escola atualizada! :)",
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

  voltar() {
    if(this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }
}
