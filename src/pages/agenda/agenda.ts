import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { Anotacao } from '../../models/anotacao.model';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {

  uid: any = undefined;
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  anotacoes: Anotacao[];

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController
  ) {
    this.anotacoes = [];
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;

      let loadind = this.loadingCtrl.create({
        content: "Carregando Agenda..."
      });
      loadind.present();

      firebase.firestore().collection("anotacoes")
      .where("user", "==", this.uid).get()
      .then((data) => {
        console.log("Anotações encontradas... Listando-as...");
        console.log(data);
        this.anotacoes = [];
        let events: any[] = [];
        data.docs.forEach((doc) => {
          this.anotacoes.push({
            titulo: doc.data().titulo,
            tipo: doc.data().tipo,
            diaTodo: doc.data().diaTodo,
            disciplina: doc.data().disciplina,
            endTime: doc.data().endTime,
            id: doc.id,
            image: doc.data().image,
            obs: doc.data().obs,
            startTime: doc.data().startTime,
            user: doc.data().user,
            variavel: doc.data().variavel
          });
          events.push({
            title: doc.data().titulo,
            startTime: moment(new Date(doc.data().startTime)).add(moment(new Date(doc.data().startTime)).utcOffset() * -1, 'm').toDate(),
            endTime: moment(new Date(doc.data().endTime)).add(moment(new Date(doc.data().endTime)).utcOffset() * -1, 'm').toDate(),
            allDay: doc.data().diaTodo,
            id: doc.id
          });
        });
        console.log(events);
        setTimeout(() => {
          this.eventSource = events;
        })
        loadind.dismiss();
      }).catch((erro) => {
        console.log("Erro ao tentar encontrar as anotações da agenda.");
        console.log(erro);
        loadind.dismiss();
      });
    } else {
      this.uid = undefined;
    }
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event) {
    this.anotacoes.forEach((doc) => {
      if(doc.id == event.id) {
        console.log("Encontrou!");
        this.navCtrl.push('InfoAnotacaoPage', {
          anotacao: doc
        });
      }
    });
  }

  goCadAnotacao() {
    this.navCtrl.push('CadAnotacaoPage');
  }

}
