import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoCursoPage } from './info-curso';

@NgModule({
  declarations: [
    InfoCursoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoCursoPage),
  ],
})
export class InfoCursoPageModule {}
