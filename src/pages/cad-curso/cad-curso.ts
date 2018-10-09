import { Periodo } from './../../models/periodo.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cad-curso',
  templateUrl: 'cad-curso.html',
})
export class CadCursoPage {

  nome: string = "";
  sigla: string = "";
  dataInicio: any;
  dataFinalizacao: any;
  escola: any = {};
  id: any;

  periodos: Periodo[] = [];
  periodo: Periodo;
  periodosData: any[] = [];
  escolas: any[] = [];

  tipos: string[] = [
    'Bimestral',
    'Trimestral',
    'Semestral',
    'Anual'
  ];

  curso: any = {};
  editando: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    firebase.firestore().collection("escolas")
    .where("user", "==", firebase.auth().currentUser.uid)
    .orderBy("nome", "asc").get()
    .then((data) => {
      this.escolas = data.docs;
    }).catch((erro) => {
      console.log(erro);
    });

    this.curso = this.navParams.get("curso");

    if(this.curso != undefined) {
      this.editando = true;

      this.nome = this.curso.data().nome;
      this.sigla = this.curso.data().sigla;
      this.dataInicio = this.curso.data().dataInicio;
      this.dataFinalizacao = this.curso.data().dataFinalizacao;
      this.escola = this.navParams.get("escola");
      this.periodosData = this.navParams.get("periodos");

      this.periodosData.forEach((periodo) => {
        this.periodos.push({
          tipo: periodo.data().tipo,
          nome: periodo.data().nome,
          sigla: periodo.data().sigla,
          id: periodo.id
        });
      })
    }
  }

  addPeriodo() {
    this.periodo = {
      nome: "",
      sigla: "",
      tipo: ""
    };

    firebase.firestore().collection("periodos").add({
      nome: this.periodo.nome,
      sigla: this.periodo.sigla,
      tipo: this.periodo.tipo,
      user: firebase.auth().currentUser.uid
    }).then((doc) => {
      console.log("Periodo Cadastrado");
      console.log(doc);

      this.periodo.id = doc.id;
      this.periodos.push(this.periodo);
    }).catch((erro) => {
      console.log("Erro ao Cadastrar Periodo");
      console.log(erro);
    });

  }

  removePeriodo(periodo) {
    let index = this.periodos.indexOf(periodo);

    if(index > -1) {
      firebase.firestore().collection("periodos").doc(periodo.id).delete()
      .then(() => {
        console.log("Periodo Excluido");

        this.periodos.splice(index, 1);
      }).then((erro) => {
        console.log("Erro ao Excluir Periodo");
        console.log(erro);
      });
    }

  }

  salvar() {
    if(!this.editando) {
      firebase.firestore().collection("escolas")
      .where("nome", "==", this.escola)
      .get()
      .then((data) => {
        data.docs.forEach((data) => {
          let i = 0;
          if(i == 0) {
            i++;

            firebase.firestore().collection("cursos").add({
              nome: this.nome,
              sigla: this.sigla,
              dataInicio: this.dataInicio,
              dataFinalizacao: this.dataFinalizacao,
              escola: data.id,
              user: firebase.auth().currentUser.uid
            }).then((doc) => {
              console.log(doc);

              this.periodos.forEach((periodo) => {
                firebase.firestore().collection("periodos").doc(periodo.id).update({
                  nome: periodo.nome,
                  sigla: periodo.sigla,
                  tipo: periodo.tipo,
                  curso: doc.id
                }).then((doc) => {
                  console.log(doc);
                }).catch((erro) => {
                  console.log(erro);
                });
              });

              this.navCtrl.setRoot('CursosPage');

              this.toastCtrl.create({
                message: "Curso cadastrado com sucesso!",
                duration: 3000
              }).present();
            }).catch((erro) => {
              console.log(erro);

              this.toastCtrl.create({
                message: "Ocorreu um erro ao cadastrar o curso",
                duration: 3000
              }).present();
            });
          }
        });
      }).catch((erro) => {
        console.log(erro);
      });
    } else {
      firebase.firestore().collection("escolas")
      .where("nome", "==", this.escola)
      .get()
      .then((data) => {
        data.docs.forEach((data) => {
          let i = 0;
          if(i == 0) {
            i++;

            firebase.firestore().collection("cursos").doc(this.curso.id).update({
              nome: this.nome,
              sigla: this.sigla,
              dataInicio: this.dataInicio,
              dataFinalizacao: this.dataFinalizacao,
              escola: data.id
            }).then((doc) => {
              console.log(doc);

              this.periodos.forEach((periodo) => {
                firebase.firestore().collection("periodos").doc(periodo.id).update({
                  nome: periodo.nome,
                  sigla: periodo.sigla,
                  tipo: periodo.tipo,
                  curso: this.curso.id
                }).then((doc) => {
                  console.log(doc);
                }).catch((erro) => {
                  console.log(erro);
                });
              });

              this.navCtrl.setRoot('CursosPage');

              this.toastCtrl.create({
                message: "Curso atualizado com sucesso!",
                duration: 3000
              }).present();
            }).catch((erro) => {
              console.log(erro);

              this.toastCtrl.create({
                message: "Ocorreu um erro ao atualizar o curso",
                duration: 3000
              }).present();
            });
          }
        });
      }).catch((erro) => {
        console.log(erro);
      });
    }
  }

}
