import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';

import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  user: any;
  foto: string;
  nome: string;
  edit: boolean;
  imgMudou: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private toastCtrl: ToastController
  ) {
    this.user = "";
    this.foto = "assets/imgs/person.png";
    this.nome = "";
    this.edit = false;
    this.imgMudou = false;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    this.user = firebase.auth().currentUser;

    if(this.user.photoURL == "" || this.user.photoURL == null) {
      this.foto = "assets/imgs/person.png";
    } else {
      this.foto = this.user.photoURL;
    }

    this.nome = this.user.displayName;
    console.log(this.user);
  }

  salvar() {
    if(this.imgMudou) {
      this.upload(this.user.uid);
    } else {
      let newUser: firebase.User = this.user;
      let photo: string;
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      if(this.user.photoURL == "" || this.user.photoURL == null) {
        photo = "";
      } else {
        photo = this.user.photoURL;
      }

      newUser.updateProfile({
        displayName: this.nome,
        photoURL: photo
      }).then(() => {
        loading.dismiss();
        this.toastCtrl.create({
          message: "Seus dados foram atualizados! :)",
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

    this.edit = false;
  }

  editar() {
    this.edit = true;
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
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true
    }

    this.camera.getPicture(options)
    .then((base64Image) => {
      this.foto = "data:image/png;base64," + base64Image;
      this.imgMudou = true;
    }).catch((erro) => {
      console.log(erro);
    });
  }

  carregarCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true
    }

    this.camera.getPicture(options)
    .then((base64Image) => {
      this.foto = "data:image/png;base64," + base64Image;
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
      let ref = firebase.storage().ref("perfilImages/" + nome);
      let uploadTask = ref.putString(this.foto.split(',')[1], "base64");

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
          let newUser: firebase.User = this.user;

          newUser.updateProfile({
            displayName: this.nome,
            photoURL: url
          }).then(() => {
            loading.dismiss();
            this.toastCtrl.create({
              message: "Seus dados foram atualizados! :)",
              duration: 3000
            }).present();
            resolve();
          }).catch((erro) => {
            console.log(erro);
            loading.dismiss();
            this.toastCtrl.create({
              message: "Ocorreu um erro inesperado. :(",
              duration: 3000
            }).present();
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
