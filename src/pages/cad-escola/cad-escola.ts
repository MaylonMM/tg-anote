import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cad-escola',
  templateUrl: 'cad-escola.html',
})
export class CadEscolaPage {

  nome: string = "";
  sigla: string = "";
  telefone: string = "";
  email: string = "";
  endereco: string = "";
  cidade: string = "";
  estado: string = "";
  user: any;

  escola: any = {};
  editando: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    this.escola = this.navParams.get("escola");
    if(this.escola != undefined) {
      this.editando = true;

      this.nome = this.escola.data().nome;
      this.sigla = this.escola.data().sigla;
      this.telefone = this.escola.data().telefone;
      this.email = this.escola.data().email;
      this.endereco = this.escola.data().endereco;
      this.cidade = this.escola.data().cidade;
      this.estado = this.escola.data().estado;
    }
  }

  salvar() {
    if(!this.editando) {
      firebase.firestore().collection("escolas").add({
        nome: this.nome,
        sigla: this.sigla,
        telefone: this.telefone,
        email: this.email,
        endereco: this.endereco,
        cidade: this.cidade,
        estado: this.estado,
        user: firebase.auth().currentUser.uid
      }).then((doc) => {
        console.log(doc);

        this.navCtrl.setRoot('EscolasPage');

        this.toastCtrl.create({
          message: "Escola cadastrada com sucesso!",
          duration: 3000
        }).present();
      }).catch((erro) => {
        console.log(erro);

        this.toastCtrl.create({
          message: "Ocorreu um erro ao cadastrar a escola",
          duration: 3000
        }).present();
      });
    } else {
      firebase.firestore().collection("escolas").doc(this.escola.id).update({
        nome: this.nome,
        sigla: this.sigla,
        telefone: this.telefone,
        email: this.email,
        endereco: this.endereco,
        cidade: this.cidade,
        estado: this.estado,
      }).then((doc) => {
        console.log(doc);

        this.navCtrl.setRoot('EscolasPage');

        this.toastCtrl.create({
          message: "Dados atualizados com sucesso!",
          duration: 3000
        }).present();
      }).catch((erro) => {
        console.log(erro);

        this.toastCtrl.create({
          message: "Ocorreu um erro ao atualizar os dados",
          duration: 3000
        }).present();
      });
    }
  }

}
