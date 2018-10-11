import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaPage } from './agenda';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [
    AgendaPage,
  ],
  imports: [
    IonicPageModule.forChild(AgendaPage),
    NgCalendarModule
  ],
})
export class AgendaPageModule {}
