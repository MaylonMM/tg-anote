import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import firebase from 'firebase';
import moment from 'moment';

import { Anotacao } from '../../models/anotacao.model';
import { Disciplina } from '../../models/disciplina.model';
import { SelectOpt } from '../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-cad-anotacao',
  templateUrl: 'cad-anotacao.html',
})
export class CadAnotacaoPage {

  uid: string;
  anotacao: Anotacao;
  disciplina: Disciplina;
  disciplinas: Disciplina[];
  selectOptDisciplina: SelectOpt;
  selectOptTipo: SelectOpt;
  selectOptNota: SelectOpt;
  tipos: string[];
  edit: boolean;
  vincNota: boolean;
  nota: number;
  dataMin: string;
  dataMax: string;
  tipoData: string;
  imgMudou: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera
  ) {
    this.uid = "";
    this.anotacao = new Anotacao;
    this.disciplina = new Disciplina;
    this.disciplinas = [];
    this.selectOptDisciplina = { title: "Disciplinas", subTitle: "Selecione uma disciplina" };
    this.selectOptTipo = { title: "Tipos", subTitle: "Selecione um tipo de anotação" };
    this.selectOptNota = { title: "Notas", subTitle: "Selecione um uma nota para vincular a anotação" };
    this.tipos = [ "Avaliação", "Trabalho", "Lição de Casa", "Lembrete", "Outro" ];
    this.edit = false;
    this.vincNota = false;
    this.nota = 0;
    this.anotacao.startTime = moment(new Date()).add(moment(new Date()).utcOffset(), 'm').toISOString();
    this.anotacao.endTime = moment(new Date()).add(moment(new Date()).utcOffset() + 60, 'm').toISOString();
    this.dataMin = moment().add(-20, 'y').toISOString();
    this.dataMax = moment().add(20, 'y').toISOString();
    this.tipoData = "DD/MM/YYYY HH:mm"
    this.imgMudou = false;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosAnotacao = this.navParams.get("anotacao");

    if(user != null) {
      this.uid = user.uid;
      let loading = this.loadingCtrl.create({
        content: "Carregando Disciplinas..."
      });
      loading.present();

      firebase.firestore().collection("disciplinas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.disciplinas = [];
        data.docs.forEach((disciplina) => {
          this.disciplinas.push({
            nome: disciplina.data().nome,
            sigla: disciplina.data().sigla,
            periodo: disciplina.data().periodo,
            notaMax: disciplina.data().notaMax,
            notaMed: disciplina.data().notaMed,
            notaMin: disciplina.data().notaMin,
            formula: disciplina.data().formula,
            professor: disciplina.data().professor,
            user: disciplina.data().user,
            id: disciplina.id
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

    if(dadosAnotacao != undefined) {
      this.edit = true;
      this.anotacao = dadosAnotacao;
      this.disciplina = this.navParams.get("disciplina");
      this.onChangeDiaTodo();

      if(this.anotacao.variavel != '') {
        this.vincNota = true;
        this.onChangeNota(this.anotacao.variavel);
      }
    }
  }

  salvar() {
    this.anotacao.startTime = moment(new Date(this.anotacao.startTime)).toISOString();
    this.anotacao.endTime = moment(new Date(this.anotacao.endTime)).toISOString();

    if(this.edit) {
      this.atualizar();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("anotacoes").add({
        titulo: this.anotacao.titulo,
        tipo: this.anotacao.tipo,
        startTime: this.anotacao.startTime,
        endTime: this.anotacao.endTime,
        diaTodo: this.anotacao.diaTodo,
        obs: this.anotacao.obs,
        disciplina: this.anotacao.disciplina,
        variavel: this.anotacao.variavel,
        image: this.anotacao.image,
        user: this.uid
      }).then(async (doc) => {
        if(this.anotacao.image != "") {
          await this.upload(doc.id);
        }
        this.navCtrl.setRoot('AgendaPage');
        loading.dismiss();
        this.toastCtrl.create({
          message: "Anotação cadastrada! :)",
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

      if(this.vincNota) {
        firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
          formula: this.disciplina.formula
        }).then(() => {

        }).catch((erro) => {
          console.log(erro);
          loading.dismiss();
          this.toastCtrl.create({
            message: "Ocorreu um erro inesperado ao vincular a nota. :(",
            duration: 3000
          }).present();
        });
      }
    }

  }

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando..."
    });
    loading.present();

    firebase.firestore().collection("anotacoes").doc(this.anotacao.id).update({
      titulo: this.anotacao.titulo,
      tipo: this.anotacao.tipo,
      startTime: this.anotacao.startTime,
      endTime: this.anotacao.endTime,
      diaTodo: this.anotacao.diaTodo,
      obs: this.anotacao.obs,
      disciplina: this.anotacao.disciplina,
      variavel: this.anotacao.variavel,
    }).then(async () => {
      if(this.anotacao.image != "" && this.imgMudou) {
        await this.upload(this.anotacao.id);
      }
      this.navCtrl.setRoot('AgendaPage');
      loading.dismiss();
      this.toastCtrl.create({
        message: "Anotação atualizada! :)",
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

    if(this.vincNota) {
      firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
        formula: this.disciplina.formula
      }).then(() => {

      }).catch((erro) => {
        console.log(erro);
        loading.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado ao vincular a nota. :(",
          duration: 3000
        }).present();
      });
    }
  }

  onChangeDisciplina(disciplina: string) {
    this.disciplinas.forEach((d) => {
      if(d.id == disciplina) {
        this.disciplina = d;
      }
    });
  }

  onChangeNota(variavel: string) {
    this.disciplina.formula.variaveis.forEach((v) => {
      if(v.nome == variavel) {
        this.nota = v.valor;
      }
    });

    //atualizar essa logica colocando uma nova variavel
    //if(this.edit && variavel != this.anotacao.variavel) {
      //this.alertCtrl.create({
        //title: "Atenção! :o",
        //message: "Você está alterando uma avaliação que já foi salva por outra, lembre-se de trocar (se for preciso) o valor da avaliação antiga antes de fazer essa alteração.",
        //buttons: [ { text: "Entendi! :)" } ]
      //}).present();
    //}
  }

  onChangeValor(nota) {
    let novoValor;

    if(nota.value == "") {
      novoValor = 0;
    } else {
      novoValor = nota.value;
    }

    this.disciplina.formula.variaveis.forEach((v) => {
      if(v.nome == this.anotacao.variavel) {
        v.valor = novoValor
      }
    });
  }

  onChangeStartTime(data) {
    console.log(moment(this.anotacao.startTime).diff(moment(this.anotacao.endTime)));
    if(moment(this.anotacao.startTime).diff(moment(this.anotacao.endTime)) > 0) {
      console.log("Entrou");
      this.anotacao.endTime = this.anotacao.startTime;
    }
  }

  onChangeEndTime(data) {
    console.log(moment(this.anotacao.startTime).diff(moment(this.anotacao.endTime)));
    if(moment(this.anotacao.startTime).diff(moment(this.anotacao.endTime)) > 0) {
      console.log("Entrou");
      this.anotacao.startTime = this.anotacao.endTime;
    }
  }

  onChangeDiaTodo() {
    if(this.anotacao.diaTodo) {
      this.tipoData = "DD/MM/YYYY";
    } else {
      this.tipoData = "DD/MM/YYYY HH:mm";
    }

    this.anotacao.startTime = this.anotacao.startTime;
    this.anotacao.endTime = this.anotacao.endTime;
  }

  addFoto() {
    let act = this.actionSheetCtrl.create({
      title: "Selecione",
      buttons: [
        {
          text: "Galeria",
          icon: "image",
          handler: () => {
            this.carregarGaleria();
          }
        },
        {
          text: "Câmera",
          icon: "camera",
          handler: () => {
            this.carregarCamera();
          }
        },
        {
          text: "Cancelar",
          icon: "close"
        }
      ]
    });
    act.present();
  }

  carregarGaleria() {
    let options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: false
    }

    this.camera.getPicture(options)
    .then((base64Image) => {
      this.anotacao.image = "data:image/jpeg;base64," + base64Image;
      this.imgMudou = true;
    }).catch((erro) => {
      console.log(erro);
    });
  }

  carregarCamera() {
    let options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: false
    }

    this.camera.getPicture(options)
    .then((base64Image) => {
      this.anotacao.image = "data:image/jpeg;base64," + base64Image;
      this.imgMudou = true;
    }).catch((erro) => {
      console.log(erro);
    });
  }

  upload(nome: string) {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: "Enviando Imagem..."
      });
      loading.present();
      let ref = firebase.storage().ref("anotacoesImages/" + nome);
      let uploadTask = ref.putString(this.anotacao.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot);
        let porcentagem = Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100);
        loading.setContent(porcentagem + "% Enviado...");
      }, (erro) => {
        console.log(erro);
      }, () => {
        console.log("A imagem foi enviada! :)");
        uploadTask.snapshot.ref.getDownloadURL()
        .then((url) => {
          firebase.firestore().collection("anotacoes").doc(nome).update({
            image: url
          }).then(() => {
            loading.dismiss();
            resolve();
          }).catch((erro) => {
            console.log(erro);
            loading.dismiss();
            reject();
          });
        }).catch((erro) => {
          console.log(erro);
          loading.dismiss();
          reject();
        });
      });
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
