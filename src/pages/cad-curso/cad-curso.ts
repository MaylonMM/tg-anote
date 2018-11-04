import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';
import moment from 'moment';

import { Curso } from '../../models/curso.model';
import { Periodo } from '../../models/periodo.model';
import { Escola } from '../../models/escola.model';
import { SelectOpt } from '../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-cad-curso',
  templateUrl: 'cad-curso.html',
})
export class CadCursoPage {

  uid: string;
  curso: Curso;
  periodos: Periodo[];
  escolas: Escola[];
  tipos: string[];
  selectOptEscola: SelectOpt;
  selectOptTipo: SelectOpt;
  edit: boolean
  dataMin: string;
  dataMax: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.uid = ""
    this.curso = new Curso;
    this.periodos = [];
    this.escolas = [];
    this.tipos = ['Bimestral','Trimestral','Semestral','Anual'];
    this.selectOptEscola = { title: "Escolas", subTitle: "Selecione uma escola" };
    this.selectOptTipo = { title: "Tipo de Período", subTitle: "Selecione o tipo/duração do período. Ex.: Semestral quando o período durar 6 meses" };
    this.edit = false;
    this.dataMin = moment().add(-100, 'y').year().toString();
    this.dataMax = moment().add(100, 'y').year().toString();
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosCurso = this.navParams.get("curso");

    if(user != null) {
      this.uid = user.uid;
      let loading = this.loadingCtrl.create({
        content: "Carregando..."
      });
      loading.present();

      firebase.firestore().collection("escolas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.escolas = [];
        data.docs.forEach((escola) => {
          this.escolas.push({
            nome: escola.data().nome,
            sigla: escola.data().sigla,
            telefone: escola.data().telefone,
            email: escola.data().email,
            endereco: escola.data().endereco,
            cidade: escola.data().cidade,
            estado: escola.data().estado,
            user: escola.data().user,
            id: escola.id
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

    if(dadosCurso != undefined) {
      this.edit = true;
      this.curso = dadosCurso;
      this.periodos = this.navParams.get("periodos");
    }
  }

  addPeriodo() {
    let periodo: Periodo = new Periodo;
    let loading = this.loadingCtrl.create({
      content: "Adicionando Período..."
    });
    loading.present();

    firebase.firestore().collection("periodos").add({
      nome: periodo.nome,
      sigla: periodo.sigla,
      tipo: periodo.tipo,
      user: this.uid
    }).then((doc) => {
      loading.dismiss();
      periodo.id = doc.id;
      this.periodos.push(periodo);
    }).catch((erro) => {
      console.log(erro);
      loading.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
    });
  }

  removePeriodo(periodo) {
    let index = this.periodos.indexOf(periodo);

    if(index > -1) {
      let loading = this.loadingCtrl.create({
        content: "Removendo Período..."
      });
      loading.present();

      firebase.firestore().collection("periodos").doc(periodo.id).delete()
      .then(() => {
        loading.dismiss();
        this.periodos.splice(index, 1);
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

  atualizarPeriodo(cursoId: string) {
    this.periodos.forEach((periodo) => {
      firebase.firestore().collection("periodos").doc(periodo.id).update({
        nome: periodo.nome,
        sigla: periodo.sigla,
        tipo: periodo.tipo,
        curso: cursoId
      }).then(() => {

      }).catch((erro) => {
        console.log(erro);
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
      });
    });
  }

  salvar() {
    this.curso.dataInicio = moment(new Date(this.curso.dataInicio)).toISOString();
    this.curso.dataFinalizacao = moment(new Date(this.curso.dataFinalizacao)).toISOString();

    if(this.edit) {
      this.atualizar();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("cursos").add({
        nome: this.curso.nome,
        sigla: this.curso.sigla,
        dataInicio: this.curso.dataInicio,
        dataFinalizacao: this.curso.dataFinalizacao,
        escola: this.curso.escola,
        user: this.uid
      }).then((doc) => {
        this.atualizarPeriodo(doc.id);
        this.navCtrl.setRoot('CursosPage');
        loading.dismiss();
        this.toastCtrl.create({
          message: "Curso cadastrado com sucesso! :)",
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

    firebase.firestore().collection("cursos").doc(this.curso.id).update({
      nome: this.curso.nome,
      sigla: this.curso.sigla,
      dataInicio: this.curso.dataInicio,
      dataFinalizacao: this.curso.dataFinalizacao,
      escola: this.curso.escola
    }).then(() => {
      this.atualizarPeriodo(this.curso.id);
      this.navCtrl.setRoot('CursosPage');
      loading.dismiss();
      this.toastCtrl.create({
        message: "Curso atualizado com sucesso! :)",
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

  onChangeStartTime(date) {
    if(moment(this.curso.dataInicio).diff(moment(this.curso.dataFinalizacao)) > 0) {
      console.log("Entrou");
      this.curso.dataFinalizacao = this.curso.dataInicio;
    }
  }

  onChangeEndTime(date) {
    if(moment(this.curso.dataInicio).diff(moment(this.curso.dataFinalizacao)) > 0) {
      console.log("Entrou");
      this.curso.dataInicio = this.curso.dataFinalizacao;
    }
  }

}
