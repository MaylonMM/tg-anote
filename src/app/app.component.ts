import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'LoadPage';
  pages: Array<{title: string, component: string}>;
  userCred: any;
  autoLogin: boolean = true;
  usuario: any = {
    nome: "Carregando...",
    foto: "../assets/imgs/person.png"
  };

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [];
    this.loadUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('0060FF');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goFor(page: string) {
    this.nav.setRoot(page);
  }

  loadUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log("Atualização feita na conta: " + user.displayName);
        this.usuario.nome = user.displayName;
        if(user.photoURL != undefined) {
          this.usuario.foto = user.photoURL;
        }

        if(this.nav.getActive().name == "LoginPage") {
          this.autoLogin = true;
        } else if(this.nav.getActive().name == "LoadPage") {
          this.autoLogin = true;
        } else {
          this.autoLogin = false;
        }

        if(this.autoLogin) {
          this.nav.setRoot('HomePage');
          this.autoLogin = false;
        }
      } else {
        this.nav.setRoot('LoginPage');
        this.autoLogin = false;
      }
    });
  }

}
