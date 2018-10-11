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

  rootPage: string = 'LoginPage';
  pages: Array<{title: string, component: string}>;
  userCred: any;
  autoLogin: boolean = true;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: 'HomePage' },
      { title: 'Escolas', component: 'EscolasPage' },
      { title: 'Cursos', component: 'CursosPage' },
      { title: 'Disciplinas', component: 'DisciplinasPage' },
      { title: 'Agenda', component: 'AgendaPage' }
    ];

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log("Atualização feita na conta de: " + user.displayName);

        if(this.nav.getActive().name == "LoginPage") {
          this.autoLogin = true;
        }

        else {
          this.autoLogin = false;
        }

        if(this.autoLogin) {
          this.nav.setRoot('HomePage');
          this.autoLogin = false;
        }
      } else {
        console.log("Sem usuário logado no sistema");
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
