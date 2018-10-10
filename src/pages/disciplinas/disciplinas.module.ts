import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisciplinasPage } from './disciplinas';

@NgModule({
  declarations: [
    DisciplinasPage,
  ],
  imports: [
    IonicPageModule.forChild(DisciplinasPage),
  ],
})
export class DisciplinasPageModule {}
